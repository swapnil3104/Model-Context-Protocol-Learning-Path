# Module 08 — Static & Dynamic Resources

> Learn how to register and expose resources (PDFs, CSVs, JSON data, images, markdown files, and databases) to LLMs via your MCP Server.

---

## 📌 Module Overview

In **Module 08**, you will learn how to make external data sources readable by Large Language Models using the Model Context Protocol.

Resources are the primary mechanism for an MCP Server to share read-only data, documents, and state with the AI model. Unlike Tools, which execute actions or dynamic code, Resources represent structured information that the AI can pull into its context.

---

## 📖 Topics Covered & Examples

### 1. File Formats & Exposing Content
- **PDF Documents**: Parsing, extracting text, and presenting clean document segments to the model.
- **CSV Data**: Formatting tabular records (e.g. logs, metrics, user exports) into prompt-friendly layouts.
- **JSON Context**: Exposing structured settings, API payloads, or object states.
- **Image Content**: Managing image assets and visual data formats.
- **Markdown Files**: Exposing formatted documentation, manuals, or readmes.

### 2. Database Resources
- **Direct database queries**: Exposing read-only views, schemas, and queries from SQL (PostgreSQL, MySQL, SQLite) and NoSQL (MongoDB, Redis) databases directly to LLMs.

---

## 💡 Best Practices for Resources

- **Metadata Matters**: Always provide detailed descriptions, names, and mime-types when registering resources.
- **Efficient Chunking**: Avoid dumping large datasets at once. Implement range-based pagination or search parameters on resource templates to protect model token limits.
- **Access Control**: Ensure the server running the resources does not leak sensitive documents without proper filtering.
