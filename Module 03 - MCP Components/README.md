# Module 03 - MCP Components

> A complete deep dive into the five fundamental primitives and protocol capabilities of the Model Context Protocol (MCP): **Tools**, **Resources**, **Prompts**, **Sampling**, and **Logging**.

---

## 📌 Module Overview

In **Module 03**, you explore the core building blocks that make up the Model Context Protocol. Each component serves a distinct purpose in bridging Large Language Models with external tools, knowledge bases, and computing environments.

Every component chapter in this module is structured into three dedicated documents:
1. **Theory**: Detailed conceptual foundations, JSON-RPC schemas, lifecycle rules, and use cases.
2. **Architecture**: System component diagrams, internal components, and boundary interactions.
3. **Communication Flow**: Step-by-step sequence diagrams and message exchanges.

---

## 🧭 Core MCP Primitives & Chapters

| Primitive | Focus & Role | Theory | Architecture | Communication Flow |
|---|---|---|---|---|
| **01. Tools** | Executable actions that enable LLMs to perform computations, API requests, database queries, and code execution. | [📖 Theory](./01%20MCP%20Tools/01_MCP%20Tools%20-%20Theory.md) | [🏗️ Architecture](./01%20MCP%20Tools/02_MCP%20Tools%20-%20Architecture.md) | [🔄 Flow](./01%20MCP%20Tools/03_MCP%20Tools%20-%20Communication%20Flow.md) |
| **02. Resources** | Passive, read-only context data (files, database records, API responses, binary assets) exposed by servers. | [📖 Theory](./02-Resources/01_MCP%20Resources%20-%20Theory.md) | [🏗️ Architecture](./02-Resources/02_MCP%20Resources%20-%20Architecture.md) | [🔄 Flow](./02-Resources/03_MCP%20Resources%20-%20Flow.md) |
| **03. Prompts** | Pre-defined, reusable instruction templates and workflows hosted on servers for clients to discover and invoke. | [📖 Theory](./03-Prompts/01_MCP%20Prompts%20-%20Theory.md) | [🏗️ Architecture](./03-Prompts/02_MCP%20Prompts%20-%20Architecture.md) | [🔄 Flow](./03-Prompts/03_MCP%20Prompts%20-%20Flow.md) |
| **04. Sampling** | Inverted capability enabling an MCP Server to request LLM completions back through the host client. | [📖 Theory](./04-Sampling/01_MCP%20Sampling%20-%20Theory.md) | [🏗️ Architecture](./04-Sampling/02_MCP%20Sampling-Architecture.md) | [🔄 Flow](./04-Sampling/03_MCP%20Sampling%20-%20Flow.md) |
| **05. Logging** | Standardized notification stream for servers to send structured diagnostics, warnings, and error messages to clients. | [📖 Theory](./05-Logging/01_MCP%20Logging%20-%20Theory.md) | [🏗️ Architecture](./05-Logging/02_MCP%20Logging%20-%20Architecture.md) | [🔄 Flow](./05-Logging/03_MCP%20Logging%20-%20Flow.md) |
| **06. Roots & Advanced** | Workspace scoping (roots), progress reporting, cancellation, argument elicitation, and ping liveness checks. | [📖 Guide](./06-Roots-and-Advanced-Capabilities/README.md) | [🏗️ Flow & Spec](./06-Roots-and-Advanced-Capabilities/README.md#2-progress-notifications-notificationsprogress) | [🔄 Protocol Envelopes](./06-Roots-and-Advanced-Capabilities/README.md#capabilities-summary-matrix) |

---

## 🧩 Architectural Relationship

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              MCP HOST                                  │
│  (Claude Desktop, Cursor, VS Code, Custom Application + Agent)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                            JSON-RPC 2.0 (stdio / HTTP+SSE)
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                             MCP SERVER                                 │
│                                                                        │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐               │
│   │    Tools     │   │  Resources   │   │   Prompts    │  Server-Side  │
│   │ (Executable) │   │ (Read-Only)  │   │ (Templates)  │  Primitives   │
│   └──────────────┘   └──────────────┘   └──────────────┘               │
│                                                                        │
│   ┌─────────────────────────────┐   ┌─────────────────────────────┐    │
│   │          Sampling           │   │           Logging           │    │
│   │  (Server-Initiated LLM Call)│   │  (Diagnostic Notifications) │    │
│   └─────────────────────────────┘   └─────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Learning Outcomes

After completing this module, you will understand:
- How each component operates under JSON-RPC 2.0 specification requirements.
- The differences between model-initiated tool calls, client resource reads, and server sampling requests.
- When to model external capabilities as a Tool vs. a Resource vs. a Prompt.
- How capabilities are negotiated during the initialization handshake.

---

## 🧭 Navigation

- ⬅️ **Previous Module:** [Module 02 - MCP Architecture](../Module%2002%20-%20MCP%20Architecture/README.md)
- 🏠 **Main Index:** [Table of Contents](../INDEX.md) | [Root README](../README.md)
- ➡️ **Next Module:** [Module 04 - Installation](../Module%2004%20-%20Installation/Installation.md)
