# Module 07 — Practical MCP Tools

> Learn how to build, expose, and test production-ready MCP Tools in Python and TypeScript, complete with schema validation, external API calls, and stdio transport.

---

## 📌 Module Overview

MCP **Tools** are executable functions exposed by an MCP Server that Large Language Models can discover and invoke to interact with external environments.

In this module, you study hands-on implementations of real-world MCP servers exposing tools:
- **Input Schema Definition:** Using Zod in TypeScript and Pydantic/type annotations with FastMCP/MCPServer in Python.
- **Transport Binding:** Communicating over Standard Input/Output (`stdio`).
- **Testing & Diagnostics:** Inspecting discovered tools and validating inputs using the official `@modelcontextprotocol/inspector`.

---

## 💡 Real-World Analogy: The Craftsman's Toolbox

> **Analogy:** Think of an LLM as a brilliant master architect who understands blueprints, physics, and design theory, but has **no hands** to physically cut wood, measure walls, or drive nails.
>
> **MCP Tools are the architect's power tools:**
> - A tape measure tool (`get_weather`) lets the architect read physical dimensions.
> - A precision laser calculator tool (`add`, `multiply`) computes exact values without hallucination.
> - A power drill tool (`write_file`) creates tangible output in the physical world.
>
> **Technical Reality:** An MCP Tool is an executable endpoint defined with a formal JSON Schema contract (`inputSchema`). The LLM does not execute the tool; it only formulates a JSON argument payload (`tools/call`). The host executes the function on the server side and returns structured `content` blocks back to the LLM context.


---

## 🛠️ Implemented Hands-on Tool Projects

| Project | Description | Python Server | TypeScript Server | Guide |
|---|---|---|---|---|
| **01. Calculator** | Arithmetic tool server exposing `add`, `subtract`, `multiply`, and `divide` with schema validation. | [server.py](./01-Calculator/Python/server.py) | [server.ts](./01-Calculator/TypeScript/server.ts) | [📖 Full Project Guide](./01-Calculator/README.md) |
| **02. Weather** | External REST API integration tool fetching live weather conditions and temperature for cities. | [server.py](./02-Weather/Python/server.py) | [server.ts](./02-Weather/TypeScript/server.ts) | [📖 Full Project Guide](./02-Weather/README.md) |

---

## 🗂️ Module Directory Structure

```text
Module 07 - Tools/
│
├── README.md
│
├── 01-Calculator/
│   ├── README.md
│   ├── Assect/
│   │   ├── Screenshot 2026-08-11 122654.png
│   │   └── Screenshot 2026-08-11 122724.png
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       ├── package.json
│       ├── tsconfig.json
│       └── server.ts
│
└── 02-Weather/
    ├── README.md
    ├── Assect/
    │   ├── weather-server-connected.png
    │   └── weather-tool-result.png
    ├── Python/
    │   ├── server.py
    │   └── requirements.txt
    └── TypeScript/
        ├── package.json
        └── server.ts
```

---

## 🚀 Extended Practice Challenges

You can extend the patterns demonstrated in `01-Calculator` and `02-Weather` to implement additional enterprise tools:

1. **03. Filesystem Server:** Expose read/write/list operations bounded within an explicit sandbox directory.
2. **04. SQLite Server:** Expose safe read-only SQL querying tools using parameterized queries.
3. **05. GitHub Server:** Integrate GitHub REST/GraphQL API to list pull requests and create issues.
4. **06. Slack / Discord Webhook Server:** Post notifications and summary reports into team communication channels.
5. **07. Notion / Notes Server:** Retrieve and append pages in a knowledge workspace.

Each challenge follows the standard MCP tool anatomy:
- Declare descriptive schema annotations (`description`, `type`, `properties`, `required`).
- Never perform unconfirmed destructive actions (enforce human-in-the-loop checks for deletes or bulk writes).
- Wrap external network calls with timeout handlers and error responses (`isError: true`).

---

## 🧭 Navigation

- ⬅️ **Previous Module:** [Module 06 — MCP Client](../Module%2006%20-%20Client/README.md)
- 🏠 **Main Index:** [Table of Contents](../INDEX.md) | [Root README](../README.md)
- ➡️ **Next Module:** [Module 08 — Static & Dynamic Resources](../Module%2008%20-%20Resources/README.md)