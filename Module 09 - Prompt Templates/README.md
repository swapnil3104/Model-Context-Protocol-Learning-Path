# Module 09 - Prompt Templates

> Learn how to declare, structure, and expose custom Prompt Templates from your MCP Server so that AI hosts can fetch and use them dynamically.

---

## 📌 Module Overview

In **Module 09**, you will explore how to standardize prompting workflows using MCP. 

Prompts allow MCP Servers to expose reusable instruction sets, user personas, and message structures directly to the LLM Host. Instead of hardcoding prompts inside your front-end or client wrapper, servers can maintain context-specific templates (like Code Review guidelines or Summarizers) and make them discoverable. You'll build prompt-hosting servers in Python and TypeScript and implement templates for Code Review, PR Review, Summarization, Meeting Notes, and Research Assistance.

---

# 📚 Learning Objectives

After completing this module, you will be able to:

- ✅ Understand why prompts are hosted on the server rather than hardcoded in the client
- ✅ Declare prompt templates with mandatory and optional arguments
- ✅ Structure system and user messages inside prompt responses
- ✅ Create templates for Code Review, Pull Request Review, and Document Summarization
- ✅ Write transcripts-to-action-items parsers and research planning prompts
- ✅ Test and resolve dynamic prompts from the client side

---

# 📖 Topics Covered

## 1. Centralized Prompt Management

- **The Problem**: Hardcoding system prompts across different applications (web, IDE extensions, CLIs) leads to duplicated code and sync problems.
- **The Solution**: Exposing prompts from the MCP Server so any connected client can list and download templates.

---

## 2. Dynamic Templates with Arguments

- **Parameterization**: Specifying argument types, descriptions, and requirement tags (e.g. `code` or `diff`).
- **Variable Interpolation**: Compiling prompts dynamically on the server by inserting user inputs into localized prompt templates.

---

## 3. Real-World Templates Covered

- **Code Review**: Configures the LLM as a senior reviewer inspecting performance, styling, bugs, and Big-O complexity.
- **PR Review**: Guidelines for inspecting Git diff changes, API breaking changes, and test files.
- **Summarizer**: Condenses documents dynamically using a `length` argument ("short", "medium", "long").
- **Meeting Notes**: Converts voice transcripts into clear Decisions and Action Item tables.
- **Research Assistant**: Formulates a detailed table of contents and keyword strategies for target topics.

---

## 4. Prompt Protocol Exchange

JSON-RPC lifecycle for prompts:
- **Discovery (`prompts/list`)**: Exposing names, descriptions, and arguments of supported templates.
- **Compilation (`prompts/get`)**: Fetching the populated list of messages (roles and text contents) for execution.

---

# 🛠 Skills You'll Gain

After this module, you'll know how to:

- Build Prompt-oriented MCP Servers
- Handle multi-turn system/user message prompts
- Leverage client argument parameters to drive prompt content
- Connect prompts with static and dynamic system contexts

---

# 📂 Suggested Folder Structure

```text
Module 09 - Prompt Templates/
│
├── README.md
├── Python/
│   └── server.py
└── TypeScript/
    ├── package.json
    └── server.ts
```

---

# 🎯 Module Outcome

By the end of this module, you'll have:

- ✔ A working Prompt Templates Server in Python and TypeScript
- ✔ Exposed 5 production-ready prompt templates (Code Review, PR Review, etc.)
- ✔ Managed arguments and dynamic string compilation on the server side
- ✔ Verified client-side prompt discoverability

---

# 🚀 What's Next?

In **Module 10**, you'll learn about **Authentication**, exploring how to manage secrets, environment variables, API Keys, and OAuth/JWT tokens securely.

---

## 💡 Key Takeaway

Server-hosted Prompts clean up your client application structure. By storing instruction templates on the server, you gain centralized version control over your prompts, allowing prompt engineering changes to take effect immediately across all connected AI applications.
