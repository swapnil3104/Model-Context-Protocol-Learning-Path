# Module 11 - Security & Sandboxing

> Learn how to build secure MCP servers, establish strict boundaries for tool execution, and guard against prompt injection or unintended system operations.

---

## 📌 Module Overview

In **Module 11**, you will focus on hardening the safety and security of the MCP ecosystem. 

Because LLMs can formulate actions dynamically, giving them direct tool execution permissions poses serious security risks. This module details safety mechanisms to protect the operating system, databases, and sensitive assets. You'll build security-oriented servers in Python and TypeScript and implement path traversal guards, safe sandboxed calculations, and human consent validations.

---

# 📚 Learning Objectives

After completing this module, you will be able to:

- ✅ Identify security risks like Indirect Prompt Injection and Command Injection
- ✅ Implement directory traversal checks (`../` escapes) to sandbox file access
- ✅ Avoid dangerous JS `eval()` or Python `eval()` execution in mathematical tools
- ✅ Design Human-in-the-Loop (HITL) consent flows for data writes and deletions
- ✅ Containerize MCP Servers with Docker and limit network access
- ✅ Apply the Principle of Least Privilege to API and database tokens

---

# 📖 Topics Covered

## 1. Prompt and Command Injections

- **Indirect Injection**: Malicious files injecting prompt instructions to hijack tool execution.
- **Command Injection**: Sanitizing user parameters to prevent execution of arbitrary system code (escaping shell delimiters).

---

## 2. Directory Traversal & Filesystem Sandboxing

- **The Threat**: Model requesting system paths (like `/etc/passwd`).
- **Defensive Pattern**: Resolving absolute paths with `path.resolve` / `abspath` and ensuring the resolved target path begins with the allowed sandbox directory.

---

## 3. Safe Math & Script Execution

- **The Threat**: Dynamic code evaluation using `eval()` leading to arbitrary execution.
- **The Defense**: Parsing parameters via regex and evaluating mathematical expressions in a clean, restricted execution scope or AST compiler.

---

## 4. Human-in-the-Loop (HITL) Approvals

- **HITL Pattern**: Write operations (deleting data, sending updates) must request confirmation.
- **Implementation**: The tool responds with a confirmation prompt if a consent flag (`user_has_approved`) is false, requiring the host application to get manual user verification before proceeding.

---

# 🛠 Skills You'll Gain

After this module, you'll know how to:

- Design secure schemas and escape parameters
- Safeguard filesystem tools against path breakout
- Setup human approval checks on mutating operations
- Run MCP servers in secure isolated containers

---

# 📂 Suggested Folder Structure

```text
Module 11 - Security/
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

- ✔ A working Security Server in Python and TypeScript
- ✔ Deployed path validation tools protecting a local sandbox directory
- ✔ Executed safe calculation engines avoiding code evaluation exploits
- ✔ Implemented a Human-in-the-Loop consent flow for data writes

---

# 🚀 What's Next?

Congratulations! You have completed the core Model Context Protocol Learning Path. You are now ready to design, deploy, and secure production-grade MCP servers and integrate them into enterprise AI systems.

---

## 💡 Key Takeaway

Security is a shared responsibility in MCP. By enforcing input validation, sandboxing the filesystem, restricting code execution, and wrapping mutating tools with human consent checks, you build resilient AI tools that leverage LLM reasoning power without exposing the underlying systems to exploitation.
