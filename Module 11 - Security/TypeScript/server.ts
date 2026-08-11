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

// 1. Safe Read File Tool (checks for directory traversal)
server.tool(
  "read_sandbox_file",
  "Read a file safely within the sandboxed directory, preventing directory traversal.",
  {
    relative_path: z.string().describe("Path relative to the allowed sandbox directory (e.g. 'allowed.txt')"),
  },
  async ({ relative_path }) => {
    await setupSandbox();
    
    // Resolve absolute path
    const targetPath = path.resolve(ALLOWED_SANDBOX_DIR, relative_path);

    // Verify target path starts with the allowed sandbox directory
    if (!targetPath.startsWith(ALLOWED_SANDBOX_DIR)) {
      return {
        content: [{
          type: "text",
          text: `SECURITY ERROR: Access Denied. Path '${relative_path}' resolved to outside the allowed sandbox: ${ALLOWED_SANDBOX_DIR}`
        }]
      };
    }

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isFile()) {
        return {
          content: [{ type: "text", text: `ERROR: '${relative_path}' is not a file.` }]
        };
      }
      const data = await fs.readFile(targetPath, "utf-8");
      return {
        content: [{ type: "text", text: data }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `ERROR: File not found or inaccessible inside sandbox: ${e.message}` }]
      };
    }
  }
);

// 2. Safe Mathematical Expression Execution Tool
server.tool(
  "execute_safe_math",
  "Evaluate a mathematical expression safely without using Javascript eval().",
  {
    expression: z.string().describe("Simple mathematical expression (e.g. '2 + 5 * 10')"),
  },
  async ({ expression }) => {
    // Input Validation: Check that expression only contains digits, whitespace, and basic operators
    const mathRegex = /^[0-9\s\+\-\*\/\(\)\.]+$/;
    if (!mathRegex.test(expression)) {
      return {
        content: [{
          type: "text",
          text: "SECURITY ERROR: Invalid characters in expression. Only numbers and mathematical operators (+, -, *, /, Parentheses) are allowed."
        }]
      };
    }

    try {
      // Safe execution: build a simple evaluator or use Function constructor with strict limits.
      // Even Function constructor is safer than eval since we can limit its access, but here we can evaluate via simple calculation parsing
      // For simple math, we can create a clean environment
      const safeEval = new Function(`"use strict"; return (${expression});`);
      const result = safeEval();
      return {
        content: [{ type: "text", text: `Expression: ${expression}\nResult: ${result}` }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `ERROR: Failed to safely evaluate expression: ${e.message}` }]
      };
    }
  }
);

// 3. Human-in-the-Loop Consent Verification Tool
server.tool(
  "mock_write_action_with_consent",
  "Demonstrate Human-in-the-Loop consent validation for data writes.",
  {
    item_id: z.number().int().positive().describe("The ID of the item to update"),
    new_quantity: z.number().int().nonnegative().describe("The target quantity"),
    user_has_approved: z.boolean().optional().default(false).describe("Flag representing user consent from the client side"),
  },
  async ({ item_id, new_quantity, user_has_approved }) => {
    if (!user_has_approved) {
      return {
        content: [{
          type: "text",
          text: `PERMISSION REQUIRED: Updating item ${item_id} to quantity ${new_quantity} is a write operation. Please call this tool again and set user_has_approved=true to confirm this change.`
        }]
      };
    }

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
