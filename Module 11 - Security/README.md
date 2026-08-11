# Module 11 — Security & Sandboxing

> Learn how to build secure MCP servers, establish strict boundaries for tool execution, and guard against prompt injection or unintended system operations.

---

## 📌 Module Overview

In **Module 11**, we focus on hardening the safety and security of the MCP ecosystem. 

Because LLMs can formulate actions dynamically, giving them direct tool execution permissions poses serious security risks. This module details safety mechanisms to protect the operating system, databases, and sensitive assets.

---

## 🛡️ Key Security Topics

### 1. Permissions & User Consent
- Implementing "Human-in-the-Loop" approvals for write-actions, large transfers, or deletion queries.
- Defining read-only vs read-write access rules.

### 2. Input Validation
- Hardening schemas with strict types (e.g. Zod validators).
- Preventing SQL injection, command injection, and directory traversal attacks from dynamic LLM inputs.

### 3. Sandboxing
- Running MCP servers inside isolated environments (Docker containers, virtual machines, gVisor) to restrict host system access.

### 4. Safe Tool Execution
- Restricting filesystem commands to specific directories.
- Rate-limiting server requests and setting hard timeouts on executions to prevent resource exhaustion.

### 5. Secret Management & Token Scoping
- Principle of Least Privilege: configuring API keys and database credentials to only access the bare minimum required tables, files, or endpoints.

---

## ⚠️ Security Checklist for Production MCP Servers

- [ ] **Dockerization**: Run the MCP Server in an isolated container.
- [ ] **Strict Schema Validation**: Validate every parameter before usage.
- [ ] **No Shell Execution**: Never execute raw strings received from the model in a shell.
- [ ] **Write Approvals**: Force a manual review gate before calling tools that modify state (e.g. delete file, modify DB, send email).
