# Installing the MCP SDK for Node.js

The official TypeScript SDK is the recommended choice for building MCP servers.

---

# Step 1 — Create a Project

```bash
mkdir my-first-mcp-server
```

```bash
cd my-first-mcp-server
```

---

# Step 2 — Initialize npm

```bash
npm init -y
```

This creates:

```
package.json
```
![Screenshot](./images/image.png)

---

# Step 3 — Install the Official MCP SDK

```bash
npm install @modelcontextprotocol/sdk
```

---

# Step 4 — Install TypeScript (Recommended)

```bash
npm install -D typescript tsx @types/node
```

Initialize TypeScript:

```bash
npx tsc --init
```

---

# Step 5 — Verify Installation

Run:

```bash
npm list @modelcontextprotocol/sdk
```

Example output:

```
@modelcontextprotocol/sdk
```
![Screenshot](./Images/Screenshot%202026-08-01%20144919.png)

---

# Recommended Project Structure

```
my-first-mcp-server/

├── src/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── node_modules/
```

---

# package.json Example

```json
{
  "name": "my-first-mcp-server",
  "version": "1.0.0",
  "type": "module"
}
```

---

# Running the Server

```bash
npx tsx src/server.ts
```

---

# Common Issues

### Package Not Found

Update npm:

```bash
npm install -g npm
```

---

### Cannot Find Module

Run:

```bash
npm install
```

---

### TypeScript Errors

Install missing dependencies:

```bash
npm install -D @types/node
```

---

# Next

Create your first MCP server in the next section.