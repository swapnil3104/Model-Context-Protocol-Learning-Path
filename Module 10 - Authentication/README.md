# Module 10 - Authentication & Access Control

> Learn how to manage credentials, authenticate MCP servers with third-party APIs, and securely pass secrets between hosts, clients, and servers.

---

## 📌 Module Overview

In **Module 10**, you will explore security paradigms for authenticating your MCP Servers with external systems. 

Since MCP Servers act as gateways to local files, databases, and APIs, protecting how they authenticate and run operations is crucial. You'll learn how to keep secrets away from the LLM context while maintaining seamless access. You'll build authentication-oriented servers in Python and TypeScript and implement token validation, OAuth simulation, JWT signing/verification, and environment integrations.

---

# 📚 Learning Objectives

After completing this module, you will be able to:

- ✅ Understand the credential isolation model of MCP
- ✅ Defend API key validations against timing attacks using constant-time checks
- ✅ Simulate OAuth authorization code exchange and token refreshes
- ✅ Structure, sign, and verify JSON Web Tokens (JWT) for session management
- ✅ Load settings and credentials securely using environment variables
- ✅ Inject environment secrets into MCP server instances via client configs

---

# 📖 Topics Covered

## 1. Credential Isolation Pattern

- **The Pattern**: Separating AI logic from keys. The LLM Client has no access to sensitive keys; it only submits JSON-RPC commands. The MCP Server holds the keys and executes calls securely on the database or SaaS endpoint.

---

## 2. API Keys & Constant-Time Validation

- **Timing Attacks**: Standard comparison operators reveal key structures by failing fast.
- **Defensive Coding**: Implementing `hmac.compare_digest` in Python and `crypto.timingSafeEqual` in Node.js to ensure string checking takes identical time regardless of character alignment.

---

## 3. OAuth & JWT Flows

- **OAuth**: Exchanging authorization codes for Bearer Access Tokens and Refresh Tokens. Handling access token expiration.
- **JWT (JSON Web Tokens)**: Verifying Header, Payload, and Signature components. Hashing with a secret key (HS256) and validating token expiration (`exp`).

---

## 4. Environment variables & Host Injection

- **Env Management**: Storing keys in `.env` files and checking variables at boot.
- **Host Config**: Configuring the environment variable injection path inside desktop clients (like Claude Desktop) using the `env` block in client configurations.

---

# 🛠 Skills You'll Gain

After this module, you'll know how to:

- Configure secure credentials inside MCP Servers
- Protect validations against timing side-channels
- Parse and sign JSON Web Tokens
- Setup environment variable injection from desktop clients

---

# 📂 Suggested Folder Structure

```text
Module 10 - Authentication/
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

- ✔ A working Authentication Server in Python and TypeScript
- ✔ Safe API Key comparisons and configuration reading tools
- ✔ Deployed OAuth token simulators and JWT validators
- ✔ Configured client-to-server environment variable boundaries

---

# 🚀 What's Next?

In **Module 11**, you'll learn about **Security & Sandboxing**, focusing on folder boundaries, traversal protection, safe execution tools, and human consent.

---

## 💡 Key Takeaway

Authentication in MCP is built on the principle of credential delegation. By letting the server manage API keys, OAuth tokens, and JWTs, you keep secrets completely isolated from the LLM, reducing the risk of prompt injections leaking passwords or credentials.
