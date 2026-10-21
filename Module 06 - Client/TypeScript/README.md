# TypeScript MCP Client Example

A minimal, runnable **Model Context Protocol (MCP) Client** implemented in **TypeScript** using the official `@modelcontextprotocol/sdk`.

---

## 🎯 What This Example Teaches

1. **Process Spawning via Stdio**: Spawns an MCP Server as a child process using `StdioClientTransport`.
2. **Protocol Lifecycle Handshake**: Automatically negotiates protocol version and capabilities with `initialize` and sends `notifications/initialized`.
3. **Capability Discovery**: Calls `tools/list` to inspect what functions the server exposes.
4. **Tool Execution**: Calls `tools/call` with parameters and parses structured output blocks.
5. **Error Inspection**: Detects tool-level errors (`isError: true`) such as division by zero.
6. **Graceful Teardown**: Closes the communication pipes cleanly.

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)

---

## 🛠️ Installation & Setup

1. Open your terminal and navigate to this folder:

```bash
cd "Module 06 - Client/TypeScript"
```

2. Install dependencies:

```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` (MCP client core and stdio transport)
- `tsx` (TypeScript executor for Node.js)
- `typescript` & `@types/node`

---

## 🚀 Running the Client

Run the client using `npm start` (or `npx tsx client.ts`):

```bash
npm start
```

### 🖥️ Expected Output

```text
=== MCP Client (TypeScript) Starting ===
Connecting to MCP Server at: E:\Model-Context-Protocol-Learning-Path\Module 07 - Tools\01-Calculator\TypeScript\server.ts
Connected to MCP Server successfully!

--- 1. Discovering Tools ---
Discovered 4 tool(s):
 - add: Add two numbers
 - subtract: Subtract b from a
 - multiply: Multiply two numbers
 - divide: Divide a by b

--- 2. Calling Tool: add(a=15, b=27) ---
add Result: {
  "content": [
    {
      "type": "text",
      "text": "42"
    }
  ]
}

--- 3. Calling Tool: multiply(a=6, b=7) ---
multiply Result: {
  "content": [
    {
      "type": "text",
      "text": "42"
    }
  ]
}

--- 4. Error Handling: divide(a=10, b=0) ---
divide (by zero) Result:
  isError: true
  content: [
    {
      "type": "text",
      "text": "Error: Cannot divide by zero."
    }
  ]

=== All client operations completed successfully ===
Closing MCP client connection...
Client connection closed.
```

---

## 🔍 Code Walkthrough Step-by-Step

### 1. Transport Configuration (`StdioClientTransport`)

```typescript
const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", serverScriptPath],
});
```
- Spawns the server as a subprocess.
- Redirects `process.stdin` and `process.stdout` into JSON-RPC message streams.
- Leaves `process.stderr` intact for server logging without corrupting protocol messages.

### 2. Client Creation

```typescript
const client = new Client(
  {
    name: "example-mcp-client-ts",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);
```
- Declares the client's identity and capabilities (e.g. roots, sampling).

### 3. Connection & Handshake

```typescript
await client.connect(transport);
```
- Sends JSON-RPC `initialize` request to the server with `protocolVersion: "2024-11-05"`.
- Waits for server response containing server capabilities (`tools`, `resources`, `prompts`).
- Sends `notifications/initialized` to acknowledge the session is active.

### 4. Discovering Tools

```typescript
const toolsResponse = await client.listTools();
```
- Sends `tools/list` request.
- The server responds with an array of tool objects, including their JSON Schema parameters.

### 5. Tool Invocation & Error Handling

```typescript
const result = await client.callTool({
  name: "divide",
  arguments: { a: 10, b: 0 },
});

if (result.isError) {
  console.log("Server indicated execution error:", result.content[0].text);
}
```
- In MCP, business-logic errors (like invalid math or missing records) return `isError: true` inside a normal 200 response rather than crashing the protocol channel.
- This lets the AI model read the error explanation and recover dynamically.

---

## 🧭 Related Resources

- 🐍 [Python Client Implementation](../Python/client.py)
- 📖 [MCP Client Theory Guide](../01_MCP%20Client%20-%20Theory.md)
- 🔄 [MCP Client Communication Flow](../03_MCP%20Client%20-%20Flow.md)
