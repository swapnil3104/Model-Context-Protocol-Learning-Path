# Module 06 — MCP Client

> Discover how the MCP Client bridges host applications with MCP servers, managing session initialization, capability negotiation, tool discovery, and execution.

---

## 📌 Module Overview

The **MCP Client** is the core orchestrator on the host side responsible for establishing and managing communication with one or more MCP Servers.

While the MCP Host provides the user interface and coordinates the LLM, the MCP Client:
- Manages sub-process or network transports (stdio, Streamable HTTP/SSE).
- Performs the protocol handshake (`initialize` and `notifications/initialized`).
- Discovers available tools, resources, and prompt templates.
- Dispatches tool invocation requests and formats returned responses for the model.

---

## 📖 Module Chapters

| Chapter | Topic | Description | Link |
|---|---|---|---|
| **01** | **MCP Client — Theory** | Foundational client concepts, lifecycle states, protocol error codes, and backoff modeling. | [📖 View Theory Guide](./01_MCP%20Client%20-%20Theory.md) |
| **02** | **MCP Client — Architecture** | Component breakdown, connection managers, capability negotiation, and security boundaries. | [🏗️ View Architecture Guide](./02_MCP%20Client%20-%20Architecture.md) |
| **03** | **MCP Client — Flow** | Detailed JSON-RPC 2.0 sequence diagrams, handshake flows, and tool call traces. | [🔄 View Communication Flow](./03_MCP%20Client%20-%20Flow.md) |

---

## ⚙️ Core Client Responsibilities

An MCP Client performs four foundational operations:

1. **Connect & Negotiate:** Establish transport (stdio pipe or HTTP/SSE stream) and negotiate supported protocol versions and capabilities.
2. **Discover Capabilities:** Call `tools/list`, `resources/list`, and `prompts/list` to index what the server can perform.
3. **Execute Tools:** Receive function-calling decisions from the LLM, validate arguments against JSON Schema, and dispatch `tools/call`.
4. **Deliver Context:** Receive tool execution results, inspect for errors (`isError: true`), and feed structured content back to the model context.

---

## 🔄 Client Lifecycle Overview

```text
               ┌───────────────────────┐
               │       MCP HOST        │
               │ (AI App / IDE / Agent)│
               └───────────┬───────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │      MCP CLIENT       │
               └───────────┬───────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
  1. Initialize      2. Discover          3. Execute
  Handshake &          Tools &              Tools &
  Capabilities        Resources            Prompts
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                   Receive Response
                           │
                           ▼
                     MCP CLIENT
                           │
                           ▼
                       MCP HOST
```

---

## 💡 Real-World Analogy: The Waiter's Ordering Terminal

> **Analogy:** Think of an **MCP Host** as a restaurant customer reading the menu and deciding what they want (the AI UI & LLM). The **MCP Server** is the kitchen, staffed with specialized chefs (tools) and pantry storage (resources).
>
> The **MCP Client** is the **waiter's wireless ordering terminal**:
> - It does not cook the meal or perform the database query itself.
> - Instead, it connects to the kitchen (`transport`), checks what dishes are available today (`tools/list`), takes the customer's order parameters, transmits the ticket (`tools/call`), and brings back the plated result (`content`) to the table.
>
> **Technical Reality:** The MCP client manages JSON-RPC 2.0 framing, child process or network streams, capability negotiation, JSON Schema parameter validation, and structured error reporting.

---

## 🛠️ Hands-On Runnable Client Examples

This module includes complete, tested, and runnable MCP clients in both official SDK languages:

| Project | Language | Transport | Target Server | Link |
|---|---|---|---|---|
| **Python Client** | Python 3.10+ | STDIO Subprocess | Calculator (`01-Calculator/Python/server.py`) | [🐍 View Python Client](./Python/README.md) |
| **TypeScript Client** | TypeScript / Node.js | STDIO Subprocess | Calculator (`01-Calculator/TypeScript/server.ts`) | [🟦 View TypeScript Client](./TypeScript/README.md) |

### 🚀 Running the Clients

```bash
# Run the TypeScript Client:
cd "Module 06 - Client/TypeScript"
npm install
npm start

# Run the Python Client:
cd "Module 06 - Client/Python"
pip install mcp
python client.py
```

---

## 📂 Module Folder Structure

```text
Module 06 - Client/
│
├── README.md                          # Module overview & quickstart
├── 01_MCP Client - Theory.md          # Theoretical foundation & error modeling
├── 02_MCP Client - Architecture.md    # Internal client architecture & manager layers
├── 03_MCP Client - Flow.md            # Message flows & JSON-RPC sequences
│
├── Python/                            # Runnable Python MCP Client
│   ├── README.md                      # Setup & execution guide
│   └── client.py                      # Executable Python client script
│
└── TypeScript/                        # Runnable TypeScript MCP Client
    ├── README.md                      # Setup & execution guide
    ├── package.json                   # Dependencies & run scripts
    ├── tsconfig.json                  # TypeScript compiler settings
    └── client.ts                      # Executable TypeScript client script
```

---

## 🧭 Navigation

- ⬅️ **Previous Module:** [Module 05 - Setting Up Your First MCP Server](../Module%2005%20-%20Setting%20Up%20Your%20First%20MCP%20Server/README.md)
- 🏠 **Main Index:** [Table of Contents](../INDEX.md) | [Root README](../README.md)
- ➡️ **Next Module:** [Module 07 - MCP Tools](../Module%2007%20-%20Tools/README.md)