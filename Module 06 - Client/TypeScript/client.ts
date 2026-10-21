import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Minimal Runnable MCP Client (TypeScript)
 *
 * Demonstrates:
 * 1. Spawning an MCP Server child process over STDIO.
 * 2. Performing the initialize handshake & capability negotiation.
 * 3. Discovering available tools (tools/list).
 * 4. Executing a tool (tools/call) and handling results.
 * 5. Handling tool-level and transport-level error scenarios.
 * 6. Graceful connection teardown.
 */
async function main() {
  console.log("=== MCP Client (TypeScript) Starting ===");

  // Path to target server (using Calculator server from Module 07)
  const serverScriptPath = path.resolve(
    __dirname,
    "../../Module 07 - Tools/01-Calculator/TypeScript/server.ts"
  );

  console.log(`Connecting to MCP Server at: ${serverScriptPath}`);

  // 1. Initialize STDIO transport: launches server as a sub-process
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", serverScriptPath],
  });

  // 2. Instantiate MCP Client with client metadata
  const client = new Client(
    {
      name: "example-mcp-client-ts",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    // 3. Connect: performs JSON-RPC 'initialize' request and 'notifications/initialized'
    await client.connect(transport);
    console.log("Connected to MCP Server successfully!\n");

    // 4. Discover tools (tools/list)
    console.log("--- 1. Discovering Tools ---");
    const toolsResponse = await client.listTools();
    console.log(`Discovered ${toolsResponse.tools.length} tool(s):`);
    for (const tool of toolsResponse.tools) {
      console.log(` - ${tool.name}: ${tool.description}`);
    }
    console.log();

    // 5. Invoke a tool: add(15, 27)
    console.log("--- 2. Calling Tool: add(a=15, b=27) ---");
    const addResult = await client.callTool({
      name: "add",
      arguments: { a: 15, b: 27 },
    });
    console.log("add Result:", JSON.stringify(addResult, null, 2));
    console.log();

    // 6. Invoke a tool: multiply(6, 7)
    console.log("--- 3. Calling Tool: multiply(a=6, b=7) ---");
    const mulResult = await client.callTool({
      name: "multiply",
      arguments: { a: 6, b: 7 },
    });
    console.log("multiply Result:", JSON.stringify(mulResult, null, 2));
    console.log();

    // 7. Error handling demonstration: divide by zero
    console.log("--- 4. Error Handling: divide(a=10, b=0) ---");
    const divResult = await client.callTool({
      name: "divide",
      arguments: { a: 10, b: 0 },
    });
    console.log("divide (by zero) Result:");
    console.log("  isError:", divResult.isError ?? false);
    console.log("  content:", JSON.stringify(divResult.content, null, 2));
    console.log();

    console.log("=== All client operations completed successfully ===");
  } catch (error) {
    console.error("Client encountered an error:", error);
  } finally {
    // 8. Graceful shutdown
    console.log("Closing MCP client connection...");
    await client.close();
    console.log("Client connection closed.");
  }
}

main().catch((err) => {
  console.error("Fatal client error:", err);
  process.exit(1);
});
