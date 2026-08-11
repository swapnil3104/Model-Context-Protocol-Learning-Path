# Calculator MCP Tool

A simple **Model Context Protocol (MCP) Calculator Tool** implemented in both **Python** and **TypeScript**.

This module demonstrates how an MCP server exposes calculator operations as tools that can be discovered and executed by an MCP client.

---

## 📁 Project Structure

```text
01-Calculator/
│
├── README.md
│
├── Python/
│   └── server.py
│
└── TypeScript/
    └── server.ts
```

---

# 🎯 Objective

The purpose of this module is to understand how to create and expose custom tools using MCP.

The Calculator MCP Server provides four tools:

* `add`
* `subtract`
* `multiply`
* `divide`

An MCP client can discover these tools and call them with the required input parameters.

---

# 🧩 MCP Tool Architecture

```text
                    ┌─────────────────────┐
                    │      MCP Client     │
                    │                     │
                    │  AI Application     │
                    └──────────┬──────────┘
                               │
                               │ MCP Protocol
                               ▼
                    ┌─────────────────────┐
                    │   Calculator MCP    │
                    │       Server        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
          ┌──────┐          ┌──────┐          ┌──────┐
          │ add  │          │  -   │          │  ×   │
          └──────┘          └──────┘          └──────┘
                                                  │
                                                  ▼
                                             ┌────────┐
                                             │ divide │
                                             └────────┘
```

---

# 🛠️ Available Tools

## 1. Add

Adds two numbers.

### Tool

```text
add
```

### Input

```json
{
  "a": 10,
  "b": 20
}
```

### Output

```text
30
```

### Formula

```text
a + b
```

---

## 2. Subtract

Subtracts the second number from the first number.

### Tool

```text
subtract
```

### Input

```json
{
  "a": 20,
  "b": 10
}
```

### Output

```text
10
```

### Formula

```text
a - b
```

---

## 3. Multiply

Multiplies two numbers.

### Tool

```text
multiply
```

### Input

```json
{
  "a": 10,
  "b": 5
}
```

### Output

```text
50
```

### Formula

```text
a × b
```

---

## 4. Divide

Divides the first number by the second number.

### Tool

```text
divide
```

### Input

```json
{
  "a": 20,
  "b": 5
}
```

### Output

```text
4
```

### Formula

```text
a / b
```

The server also handles division by zero.

```text
divide(10, 0)
```

Result:

```text
Cannot divide by zero
```

---

# 🐍 Python Implementation

The Python implementation uses the MCP Python SDK and `FastMCP`.

File:

```text
Python/server.py
```

Basic server structure:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Calculator")
```

Tools are registered using:

```python
@mcp.tool()
```

Example:

```python
@mcp.tool()
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b
```

The function automatically becomes an MCP tool.

---

# 🟦 TypeScript Implementation

The TypeScript implementation uses the MCP TypeScript SDK.

File:

```text
TypeScript/server.ts
```

The server is created using:

```typescript
const server = new McpServer({
  name: "Calculator",
  version: "1.0.0",
});
```

Tools are registered using:

```typescript
server.tool(...)
```

Input validation is handled using `zod`.

Example:

```typescript
server.tool(
  "add",
  "Add two numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a + b),
      },
    ],
  })
);
```

---

# 📦 Python Setup

Make sure Python is installed.

Check:

```bash
python --version
```

Install the MCP SDK:

```bash
pip install mcp
```

Run the server:

```bash
python Python/server.py
```

---

# 📦 TypeScript Setup

Go to the TypeScript directory:

```bash
cd TypeScript
```

Initialize the project:

```bash
npm init -y
```

Install the MCP SDK:

```bash
npm install @modelcontextprotocol/sdk
```

Install Zod:

```bash
npm install zod
```

Install TypeScript and TSX:

```bash
npm install -D typescript tsx
```

Run the server:

```bash
npx tsx server.ts
```

---

# 🔌 MCP Transport

This calculator uses **STDIO transport**.

The communication flow is:

```text
MCP Client
     │
     │ STDIO
     ▼
Calculator MCP Server
     │
     ├── add
     ├── subtract
     ├── multiply
     └── divide
```

STDIO allows the MCP client to start the server process and communicate with it through standard input and standard output.

---

# 🔍 Tool Discovery

One of the important capabilities of MCP is **tool discovery**.

The MCP client can ask the server:

```text
tools/list
```

The Calculator server responds with the available tools.

Conceptually:

```json
{
  "tools": [
    {
      "name": "add",
      "description": "Add two numbers"
    },
    {
      "name": "subtract",
      "description": "Subtract two numbers"
    },
    {
      "name": "multiply",
      "description": "Multiply two numbers"
    },
    {
      "name": "divide",
      "description": "Divide two numbers"
    }
  ]
}
```

The client can then decide which tool should be executed.

---

# ⚙️ Tool Execution

After discovering the tools, an MCP client can execute one.

Example:

```text
tools/call
```

with:

```json
{
  "name": "add",
  "arguments": {
    "a": 100,
    "b": 50
  }
}
```

The server executes:

```text
100 + 50
```

and returns:

```text
150
```

---

# 🔄 Complete MCP Flow

```text
             USER
               │
               │
               │ "Calculate 25 + 75"
               ▼
        ┌───────────────┐
        │   MCP HOST    │
        │      +        │
        │      LLM      │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   MCP CLIENT  │
        └───────┬───────┘
                │
                │ tools/list
                ▼
        ┌───────────────┐
        │ Calculator MCP│
        │    Server     │
        └───────┬───────┘
                │
                │ Available Tools
                ▼
       ┌─────────────────────┐
       │ add                 │
       │ subtract            │
       │ multiply            │
       │ divide              │
       └─────────┬───────────┘
                 │
                 │ tools/call
                 ▼
          add(25, 75)
                 │
                 ▼
              100
                 │
                 ▼
        ┌────────────────┐
        │   MCP Client   │
        └───────┬────────┘
                │
                ▼
              USER
```

---

# 🧪 Example Operations

| Operation | Input     | Result |
| --------- | --------- | -----: |
| Add       | `10 + 20` |   `30` |
| Subtract  | `50 - 20` |   `30` |
| Multiply  | `10 × 5`  |   `50` |
| Divide    | `100 / 4` |   `25` |

---

# ❌ Error Handling

The calculator validates potentially invalid operations.

## Division by Zero

Input:

```json
{
  "a": 10,
  "b": 0
}
```

The server should not perform:

```text
10 / 0
```

Instead, it returns an error:

```text
Cannot divide by zero
```

---

# 🧠 What This Module Demonstrates

This module demonstrates the core concepts required to create an MCP tool:

```text
1. Create MCP Server
        ↓
2. Register Tool
        ↓
3. Define Tool Description
        ↓
4. Define Input Schema
        ↓
5. Execute Tool Logic
        ↓
6. Return Tool Result
```

The Calculator is intentionally simple so that the MCP concepts are easy to understand.

---

# 📚 Concepts Covered

* MCP Server
* MCP Tool
* Tool registration
* Tool discovery
* Tool execution
* Input schemas
* Tool arguments
* Tool results
* Error handling
* STDIO transport
* Python MCP SDK
* TypeScript MCP SDK

---

# 🚀 Future Improvements

The Calculator MCP Server can be extended with additional tools.

Possible tools:

```text
power
square_root
modulo
percentage
absolute
factorial
average
maximum
minimum
```

Example:

```text
power(2, 10)
```

Result:

```text
1024
```

Another possible tool:

```text
percentage(500, 10)
```

Result:

```text
50
```

---

# 📂 Final Module Structure

```text
01-Calculator/
│
├── README.md
│
├── Python/
│   └── server.py
│
└── TypeScript/
    └── server.ts
```

---

# 🎯 Learning Goal

After completing this module, you should be able to understand how a basic function becomes an **MCP Tool** and how an MCP client can discover and execute that tool.

The same architecture can then be applied to more practical MCP tools such as:

```text
Calculator
    ↓
Weather
    ↓
Filesystem
    ↓
SQLite
    ↓
GitHub
    ↓
Email
    ↓
Slack
    ↓
Notion
    ↓
Google Drive
    ↓
Calendar
```

The Calculator module therefore serves as the **first practical MCP Tool implementation** in this repository.

## 🖥️ MCP Inspector

### Server Connection

The Calculator MCP Server is successfully connected to MCP Inspector using STDIO.

![Calculator MCP Server Connected](/Module%2007%20-%20Tools/01-Calculator/Assect/Screenshot%202026-08-11%20122654.png)

---

### Available Tools

MCP Inspector successfully discovered the Calculator tools:

- `add`
- `subtract`
- `multiply`
- `divide`

![Calculator MCP Tools](/Module%2007%20-%20Tools/01-Calculator/Assect/Screenshot%202026-08-11%20122724.png)