# Python MCP Client Example

A minimal, runnable **Model Context Protocol (MCP) Client** implemented in **Python** using the official `mcp` SDK.

---

## 🎯 What This Example Teaches

1. **Subprocess Management via Stdio**: Spawns an MCP Server child process using `stdio_client` and `StdioServerParameters`.
2. **Session Lifecycle & Handshake**: Initializes the session (`await session.initialize()`) with capability negotiation.
3. **Tool Discovery**: Calls `await session.list_tools()` to inspect exposed functions.
4. **Tool Execution**: Calls `await session.call_tool(...)` and receives structured result blocks.
5. **Exception and Error Handling**: Catches execution errors when invoking tools with invalid inputs.
6. **Clean Resource Teardown**: Leverages Python `async with` context managers for automatic pipe closure and process cleanup.

---

## 📋 Prerequisites

- **Python**: 3.10 or higher (`python --version`)
- **pip** package manager

---

## 🛠️ Installation & Setup

1. Open your terminal and navigate to this folder:

```bash
cd "Module 06 - Client/Python"
```

2. Install the official Python MCP SDK:

```bash
pip install mcp
```

---

## 🚀 Running the Client

Execute the client script:

```bash
python client.py
```

### 🖥️ Expected Output

```text
=== MCP Client (Python) Starting ===
Connecting to MCP Server at: E:\Model-Context-Protocol-Learning-Path\Module 07 - Tools\01-Calculator\Python\server.py
Performing MCP handshake...
Connected to: Calculator v1.0.0

--- 1. Discovering Tools ---
Discovered 4 tool(s):
 - add: Add two numbers.
 - subtract: Subtract b from a.
 - multiply: Multiply two numbers.
 - divide: Divide a by b.

--- 2. Calling Tool: add(a=15, b=27) ---
add Result: [TextContent(type='text', text='42.0', annotations=None, meta=None)]

--- 3. Calling Tool: multiply(a=6, b=7) ---
multiply Result: [TextContent(type='text', text='42.0', annotations=None, meta=None)]

--- 4. Error Handling: divide(a=10, b=0) ---
divide Result (isError=False):
  content: [TextContent(type='text', text="Error: Cannot divide by zero: denominator 'b' must not be 0", annotations=None, meta=None)]

=== All client operations completed successfully ===
```


---

## 🔍 Code Walkthrough Step-by-Step

### 1. Server Subprocess Parameters

```python
server_params = StdioServerParameters(
    command=sys.executable,
    args=[str(server_script)],
    env=os.environ.copy(),
)
```
- Sets the Python executable path and server file path.
- Injects process environment variables (which is how API keys and configurations are safely passed to stdio servers).

### 2. Client Connection & Session

```python
async with stdio_client(server_params) as (read_stream, write_stream):
    async with ClientSession(read_stream, write_stream) as session:
        init_result = await session.initialize()
```
- Opens duplex pipes to the server subprocess.
- Sends the standard `initialize` request and negotiates capabilities.
- Sends the `notifications/initialized` acknowledgment.

### 3. Listing Available Tools

```python
tools_result = await session.list_tools()
for tool in tools_result.tools:
    print(f" - {tool.name}: {tool.description}")
```
- Receives metadata and JSON Schema definitions for all tools exposed by the server.

### 4. Executing Tools

```python
result = await session.call_tool("add", arguments={"a": 15, "b": 27})
print(result.content)
```
- Sends `tools/call` JSON-RPC message.
- Receives structured list of content objects (e.g. `TextContent`, `ImageContent`, `EmbeddedResource`).

---

## 🧭 Related Resources

- 🟦 [TypeScript Client Implementation](../TypeScript/client.ts)
- 📖 [MCP Client Theory Guide](../01_MCP%20Client%20-%20Theory.md)
- 🔄 [MCP Client Communication Flow](../03_MCP%20Client%20-%20Flow.md)
