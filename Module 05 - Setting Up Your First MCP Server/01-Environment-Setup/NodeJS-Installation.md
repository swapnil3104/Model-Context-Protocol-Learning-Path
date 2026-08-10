# Installing Node.js

Node.js is one of the most popular environments for building MCP servers.

The official MCP TypeScript SDK runs on Node.js.

---

## Step 1

Visit

https://nodejs.org

Download the **LTS (Long Term Support)** version.

---

## Step 2

Run the installer.

Choose the default settings.

The installer automatically installs:

- Node.js
- npm (Node Package Manager)

---

## Step 3

Verify Installation

Open a terminal.

```bash
node -v
```

Example

```
v22.18.0
```

Check npm

```bash
npm -v
```

Example

```
10.9.3
```

---

## Create a Test Project

```bash
mkdir my-first-mcp
```

```bash
cd my-first-mcp
```

Initialize npm

```bash
npm init -y
```

This creates

```
package.json
```

---

## Why Node.js?

Node.js provides

- Fast runtime
- Large ecosystem
- Excellent TypeScript support
- Official MCP SDK compatibility
- Cross-platform development

---

## Common Commands

Install package

```bash
npm install package-name
```

Install development dependency

```bash
npm install --save-dev package-name
```

Run project

```bash
node server.js
```

---

## Troubleshooting

### node is not recognized

Restart your terminal.

or reinstall Node.js.

---

### npm is not recognized

Ensure Node.js was installed correctly.

---

### PATH issues

Add Node.js installation directory to your system PATH.

Usually

```
C:\Program Files\nodejs\
```

---

## Next

Install Python (optional but recommended).