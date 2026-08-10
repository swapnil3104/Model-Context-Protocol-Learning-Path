# MCP SDK Installation Commands

This document provides a quick reference for commonly used installation and setup commands.

---

# Node.js Commands

### Create Project

```bash
mkdir my-mcp-server
```

```bash
cd my-mcp-server
```

---

### Initialize npm

```bash
npm init -y
```

---

### Install MCP SDK

```bash
npm install @modelcontextprotocol/sdk
```

---

### Install TypeScript

```bash
npm install -D typescript tsx @types/node
```

---

### Initialize TypeScript

```bash
npx tsc --init
```

---

### Run Server

```bash
npx tsx src/server.ts
```

---

# Python Commands

### Create Project

```bash
mkdir my-python-mcp
```

```bash
cd my-python-mcp
```

---

### Create Virtual Environment

```bash
python -m venv .venv
```

---

### Activate (Windows)

```bash
.venv\Scripts\activate
```

---

### Activate (Linux/macOS)

```bash
source .venv/bin/activate
```

---

### Install MCP SDK

```bash
pip install mcp
```

---

### Save Dependencies

```bash
pip freeze > requirements.txt
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Git Commands

Clone Repository

```bash
git clone <repository-url>
```

Check Status

```bash
git status
```

Commit Changes

```bash
git add .
git commit -m "Initial MCP setup"
```

Push Changes

```bash
git push origin main
```

---

# Verify Installations

Node.js

```bash
node -v
```

npm

```bash
npm -v
```

Python

```bash
python --version
```

pip

```bash
pip --version
```

Git

```bash
git --version
```

---

# Useful Tips

- Always use the latest stable version of Node.js or Python.
- Create a virtual environment for Python projects.
- Keep dependencies updated.
- Use Git for version control.
- Read the official MCP SDK documentation for the latest API changes.

---

## Next Step

With the SDK installed, you're ready to build and run your first MCP server in the next module.