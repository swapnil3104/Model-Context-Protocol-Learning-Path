# Module 05 - Setting Up Your First MCP Server

> Learn how to build, run, and connect your first Model Context Protocol (MCP) server using the official MCP SDK.

---

## 📌 Module Overview

In **Module 05**, you'll move from theory to practice by creating your first working **MCP Server**.

You'll learn how to set up the development environment, install the official SDK, create tools and resources, connect the server to an MCP Host (such as Claude Desktop), and understand the complete development workflow.

By the end of this module, you'll have a fully functional MCP server that AI assistants can communicate with.

---

## 💡 Real-World Analogy: Building a Custom USB Accessory

> **Analogy:** Think of building your first MCP Server as **building a specialized USB accessory** (like an external barcode scanner or digital precision scale) for your laptop:
> - You do not need to rebuild the laptop's motherboard or AI operating system.
> - Instead, you write a lightweight driver service that communicates through standard input and output pipes (`stdio`).
> - You announce what buttons or sensors the device provides (`tools`), and plug it into the host. The AI host detects the new accessory immediately and can use its features without bespoke point-to-point integration code.
>
> **Technical Reality:** An MCP Server is an independent process that implements the MCP specification. It binds to a transport (`stdio` or `Streamable HTTP / SSE`), negotiates capabilities upon connection, and responds to standard JSON-RPC 2.0 requests.


---

# 📚 Learning Objectives

After completing this module, you will be able to:

- ✅ Understand the MCP development workflow
- ✅ Install the official MCP SDK
- ✅ Configure the development environment
- ✅ Build your first MCP Server
- ✅ Register Tools
- ✅ Register Resources
- ✅ Connect the server to an MCP Host
- ✅ Test requests and responses
- ✅ Debug common MCP issues

---

# 📖 Topics Covered

## 1. Development Environment Setup

- Installing Node.js / Python (depending on SDK)
- Choosing a code editor
- Creating a project
- Package management
- Environment variables

---

## 2. Installing the Official MCP SDK

Learn how to install:

- MCP SDK
- Dependencies
- Project structure
- Configuration files

---

## 3. Creating Your First MCP Server

You'll build a basic server that can:

- Start successfully
- Accept requests
- Return responses
- Expose capabilities

---

## 4. Registering Tools

Learn how MCP Tools work.

Examples:

- Calculator Tool
- Weather Tool
- Search Tool
- Current Time Tool

You'll understand:

- Tool Names
- Descriptions
- Input Schema
- Output Format

---

## 5. Registering Resources

Resources expose static or dynamic information.

Examples:

- Documentation
- Markdown Files
- JSON Data
- Configuration Files
- API Specifications

---

## 6. Connecting to an MCP Host

Understand how an MCP Host discovers and communicates with servers.

Example Hosts:

- Claude Desktop
- AI IDEs
- AI Coding Agents
- Custom Applications

---

## 7. Testing Your MCP Server

Learn how to:

- Verify server startup
- Send requests
- Validate responses
- Inspect logs
- Test tools
- Test resources

---

## 8. Debugging MCP Applications

Common issues:

- SDK installation problems
- Server startup failures
- Invalid tool schemas
- Missing resources
- Connection errors
- JSON formatting mistakes
- Permission issues

---

# 🛠 Skills You'll Gain

After this module, you'll know how to:

- Build MCP Servers
- Register Tools
- Register Resources
- Configure SDKs
- Connect AI applications
- Debug MCP Servers
- Understand the MCP development lifecycle

---

# 📂 Actual Folder Structure

```text
Module 05 - Setting Up Your First MCP Server/
│
├── README.md
├── 01-Environment-Setup/
│   ├── README.md
│   ├── NodeJS-Installation.md
│   ├── Python-Installation.md
│   └── VSCode-Extensions.md
└── 02-Installing-MCP-SDK/
    ├── README.md
    ├── NodeJS-SDK.md
    ├── Python-SDK.md
    ├── Installation-Commands.md
    ├── my-first-mcp-server/ (TypeScript)
    └── my-python-mcp/ (Python)
```

---

# 🎯 Module Outcome

By the end of this module, you'll have:

- ✔ Your first working MCP Server in Python and TypeScript
- ✔ Basic tool registration tested and verified
- ✔ Connected to an MCP Host
- ✔ Tested end-to-end communication via stdio
- ✔ A solid foundation for building advanced MCP applications

---

# 🚀 What's Next?

In **[Module 06 — MCP Client](../Module%2006%20-%20Client/README.md)**, you'll dive deeper into how client hosts discover and execute capabilities:

- Client Architecture & Responsibilities
- Tool Discovery & Negotiation
- Executing Tools & Consuming Responses
- Python & TypeScript Client Implementations

---

## 🧭 Navigation

- ⬅️ **Previous Module:** [Module 04 - Installation](../Module%2004%20-%20Installation/Installation.md)
- 🏠 **Main Index:** [Table of Contents](../INDEX.md) | [Root README](../README.md)
- ➡️ **Next Module:** [Module 06 - MCP Client](../Module%2006%20-%20Client/README.md)

---

## 💡 Key Takeaway

This module transforms your understanding of MCP from theory into practice. By building and connecting your first MCP server, you'll gain hands-on experience with the protocol's core concepts and establish the foundation needed for more advanced MCP development.