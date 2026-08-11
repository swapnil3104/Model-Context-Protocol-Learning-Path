# Module 08 - Static & Dynamic Resources

> Learn how to register and expose resources (PDFs, CSVs, JSON data, images, markdown files, and databases) to LLMs via your MCP Server.

---

## 📌 Module Overview

In **Module 08**, you will move from theory to practice by understanding how to make external data sources readable by Large Language Models using the Model Context Protocol.

Resources are the primary mechanism for an MCP Server to share read-only data, documents, and state with the AI model. Unlike Tools, which execute actions or dynamic code, Resources represent structured information that the AI can pull into its context. You'll build a working resources server in Python and TypeScript and explore how to chunk, format, and secure these resources.

---

# 📚 Learning Objectives

After completing this module, you will be able to:

- ✅ Understand the difference between MCP Tools, Resources, and Prompts
- ✅ Declare static and templated resources inside an MCP Server
- ✅ Parse and expose text-based PDF documents to the LLM context
- ✅ Formulate prompt-friendly tabular layouts using CSV formatting
- ✅ Expose structured JSON contexts and active databases read-only
- ✅ Handle binary assets like PNG/JPEG images via Base64 blobs
- ✅ Restrict resource queries to safe directory boundaries

---

# 📖 Topics Covered

## 1. Static vs. Dynamic (Templated) Resources

Learn the two primary ways to declare resources:
- **Static Resources**: Pre-defined assets with exact, fixed URIs (e.g. `file://docs/markdown`).
- **Resource Templates**: Dynamic URIs containing arguments (e.g. `file://users/{userId}/profile`). The client compiles these URIs at runtime to query user-specific files.

---

## 2. Document & File Formats Handling

- **PDF Documents**: Extracting text streams, managing font POSITION variables, and chunking documents to fit LLM token budgets.
- **CSV Data**: Converting raw rows to markdown tables for easier LLM interpretation.
- **JSON Context**: Delivering configuration settings with standard `application/json` mime-types.
- **Image Content**: Encoding visual PNG/JPEG assets into Base64 blobs to support multimodal LLM inputs.
- **Markdown Files**: Exposing structural docs (headers, lists) using the natural markdown dialect of the model.

---

## 3. Database Resource Mappings

Exposing SQL and NoSQL database tables dynamically as read-only resources:
- Querying local tables using built-in database drivers (like `sqlite3`).
- Structuring raw records into prompt-friendly markdown format inside the server.
- Isolating database credentials from the client context.

---

## 4. Resource Protocol Exchange

Understand the JSON-RPC request-response cycles:
- **Discovery (`resources/list`)**: Listing available resources.
- **Reading (`resources/read`)**: Accessing the content of a specific resource.

---

# 🛠 Skills You'll Gain

After this module, you'll know how to:

- Build Resource-oriented MCP Servers
- Handle multiple file-based and binary mime-types (PDF, CSV, JSON, PNG, MD)
- Configure resource pagination and token boundaries
- Bridge database tables to LLM contexts safely
- Run and test resource servers inside MCP Hosts

---

# 📂 Suggested Folder Structure

```text
Module 08 - Resources/
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

- ✔ A functional Resources Server in Python and TypeScript
- ✔ Registered PDF, CSV, JSON, Markdown, and SQLite database resources
- ✔ Delivered binary PNG image resources via base64 blobs
- ✔ Validated and tested resource loading using MCP Clients

---

# 🚀 What's Next?

In **Module 09**, you'll learn about **Prompt Templates**, allowing your servers to declare reusable checklists, review patterns, and instructions that LLMs can load dynamically.

---

## 💡 Key Takeaway

Resources form the informational backbone of the Model Context Protocol. By structuring files and databases as clean, secure, read-only resources, you empower LLM agents to verify facts, consult documentations, and analyze real-world records without exposing write APIs.
