import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ALLOWED_SANDBOX_DIR = path.resolve(__dirname, "../sandbox");

const server = new McpServer({
  name: "Security Demo Server TS",
  version: "1.0.0",
});

// Setup sandbox environment
async function setupSandbox() {
  await fs.mkdir(ALLOWED_SANDBOX_DIR, { recursive: true });
  const sampleFile = path.join(ALLOWED_SANDBOX_DIR, "allowed.txt");
  try {
    await fs.access(sampleFile);
  } catch {
    await fs.writeFile(sampleFile, "This is a safe file inside the sandbox directory.");
  }
}

// 1. Safe Read File Tool (Hardened against directory traversal)
server.tool(
  "read_sandbox_file",
  "Read a file safely within the sandboxed directory, preventing directory traversal.",
  {
    relative_path: z.string().describe("Path relative to the allowed sandbox directory (e.g. 'allowed.txt')"),
  },
  async ({ relative_path }) => {
    await setupSandbox();
    
    // Resolve absolute target path
    const targetPath = path.resolve(ALLOWED_SANDBOX_DIR, relative_path);

    // Hardened check: path.relative prevents prefix-matching bypasses (e.g., ../sandbox_secret)
    const relative = path.relative(ALLOWED_SANDBOX_DIR, targetPath);
    const isOutside = relative.startsWith("..") || path.isAbsolute(relative);

    if (isOutside) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: `SECURITY ERROR: Access Denied. Path '${relative_path}' resolves outside the allowed sandbox directory.`
        }]
      };
    }

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isFile()) {
        return {
          isError: true,
          content: [{ type: "text", text: `ERROR: '${relative_path}' is not a regular file.` }]
        };
      }
      const data = await fs.readFile(targetPath, "utf-8");
      return {
        content: [{ type: "text", text: data }]
      };
    } catch (e: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `ERROR: File not found or inaccessible inside sandbox: ${e.message}` }]
      };
    }
  }
);

// Pure AST/Tokenizer arithmetic parser without using eval() or new Function()
function parseAndEvaluateMath(expr: string): number {
  const tokens = expr.match(/\d+(\.\d+)?|[+\-*/()]/g);
  if (!tokens) throw new Error("No valid tokens found");

  let pos = 0;

  function peek(): string | null {
    return pos < tokens!.length ? tokens![pos] : null;
  }

  function consume(expected?: string): string {
    const token = tokens![pos++];
    if (expected && token !== expected) {
      throw new Error(`Expected '${expected}' but got '${token}'`);
    }
    return token;
  }

  // Grammar:
  // Expr   = Term (( '+' | '-' ) Term)*
  // Term   = Factor (( '*' | '/' ) Factor)*
  // Factor = Number | '(' Expr ')' | '-' Factor

  function parseFactor(): number {
    const token = peek();
    if (token === null) throw new Error("Unexpected end of expression");

    if (token === "(") {
      consume("(");
      const val = parseExpr();
      consume(")");
      return val;
    } else if (token === "-") {
      consume("-");
      return -parseFactor();
    } else if (token === "+") {
      consume("+");
      return parseFactor();
    } else {
      const num = parseFloat(consume());
      if (isNaN(num)) throw new Error(`Invalid number: ${token}`);
      return num;
    }
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const next = parseFactor();
      if (op === "*") value *= next;
      else {
        if (next === 0) throw new Error("Division by zero");
        value /= next;
      }
    }
    return value;
  }

  function parseExpr(): number {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const next = parseTerm();
      if (op === "+") value += next;
      else value -= next;
    }
    return value;
  }

  const result = parseExpr();
  if (pos < tokens.length) {
    throw new Error(`Unexpected token at position ${pos}: ${tokens[pos]}`);
  }
  return result;
}

// 2. Safe Mathematical Expression Execution Tool
server.tool(
  "execute_safe_math",
  "Evaluate a mathematical expression safely via token parsing without eval() or new Function().",
  {
    expression: z.string().max(100).describe("Simple mathematical expression (e.g. '2 + 5 * 10')"),
  },
  async ({ expression }) => {
    // Basic character set validation
    const mathRegex = /^[0-9\s+\-*/().]+$/;
    if (!mathRegex.test(expression)) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: "SECURITY ERROR: Invalid characters in expression. Only numbers and basic operators (+, -, *, /, Parentheses) are allowed."
        }]
      };
    }

    try {
      const result = parseAndEvaluateMath(expression);
      return {
        content: [{ type: "text", text: `Expression: ${expression}\nResult: ${result}` }]
      };
    } catch (e: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `ERROR: Failed to safely evaluate expression: ${e.message}` }]
      };
    }
  }
);

// 3. State-Changing Write Action (Human-in-the-Loop Clarification)
server.tool(
  "mock_write_action_with_consent",
  "Demonstrate a state-changing write operation and explain MCP client-side HITL consent boundaries.",
  {
    item_id: z.number().int().positive().describe("The ID of the item to update"),
    new_quantity: z.number().int().nonnegative().describe("The target quantity"),
  },
  async ({ item_id, new_quantity }) => {
    // In MCP, Human-in-the-Loop consent is enforced by the MCP Host Client (UI prompt)
    // before dispatching the tools/call request.
    return {
      content: [{
        type: "text",
        text: `SUCCESS: Database updated. Item ${item_id} quantity set to ${new_quantity}.`
      }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
