# Module 4 - Installation

This module explains how to install, configure, and run MCP across different programming languages, development environments, MCP clients, and deployment methods.

The goal is to prepare a complete MCP development environment so that you can build and test MCP servers locally.

---

# Table of Contents

1. Introduction
2. Prerequisites
3. MCP Installation Overview
4. Python Installation
5. TypeScript Installation
6. Docker Installation
7. VS Code Setup
8. Claude Desktop Setup
9. Cursor Setup
10. OpenAI Setup
11. Environment Variables
12. Project Structure
13. Running an MCP Server
14. Testing MCP Installation
15. Troubleshooting
16. Installation Checklist
17. Final Summary

---

# 1. Introduction

Model Context Protocol (MCP) applications generally consist of:

```text
MCP Host
    |
    v
MCP Client
    |
    v
MCP Server
    |
    +---- Tools
    +---- Resources
    +---- Prompts
```

Before creating MCP servers, you need a development environment.

This module covers:

```text
Python
TypeScript
Docker
VS Code
Claude Desktop
Cursor
OpenAI
```

The tools serve different purposes.

| Component | Purpose |
|---|---|
| Python | Build MCP servers using Python |
| TypeScript | Build MCP servers using TypeScript/Node.js |
| Docker | Package and run MCP applications in containers |
| VS Code | Development environment |
| Claude Desktop | MCP host/client application |
| Cursor | AI-powered development environment with MCP support |
| OpenAI | Build applications that integrate with MCP-compatible workflows |

---

# 2. Prerequisites

Before starting, install the basic development tools.

Recommended:

```text
Git
Python
Node.js
npm
Docker
VS Code
```

Optional MCP clients:

```text
Claude Desktop
Cursor
```

---

# 3. MCP Installation Overview

A typical installation path is:

```text
Install Git
    |
    v
Install Python
    |
    v
Install Node.js
    |
    v
Install VS Code
    |
    v
Install MCP SDK
    |
    v
Create MCP Server
    |
    v
Test MCP Server
    |
    +---- Claude Desktop
    |
    +---- Cursor
    |
    +---- Custom MCP Client
    |
    +---- OpenAI Application
```

For containerized development:

```text
MCP Server
    |
    v
Dockerfile
    |
    v
Docker Image
    |
    v
Docker Container
    |
    v
MCP Client
```

---

# 4. Python Installation

Python is one of the common languages used to build MCP servers.

## 4.1 Check Python

Open a terminal:

```bash
python --version
```

On some systems:

```bash
python3 --version
```

Example:

```text
Python 3.x.x
```

Use a currently supported Python release appropriate for the MCP Python SDK version you are using.

---

## 4.2 Create a Project

Create a project directory:

```bash
mkdir my-mcp-server
cd my-mcp-server
```

---

## 4.3 Create Virtual Environment

Windows:

```bash
python -m venv .venv
```

Linux/macOS:

```bash
python3 -m venv .venv
```

---

## 4.4 Activate Virtual Environment

### Windows PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
.venv\Scripts\activate
```

### Linux/macOS

```bash
source .venv/bin/activate
```

After activation, you should see something similar to:

```text
(.venv)
```

in the terminal.

---

## 4.5 Install MCP Python SDK

Install the MCP Python package:

```bash
pip install mcp
```

Verify:

```bash
pip show mcp
```

---

## 4.6 Create Python MCP Server

Create:

```text
server.py
```

Example:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My MCP Server")


@mcp.tool()
def add_numbers(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


if __name__ == "__main__":
    mcp.run()
```

---

## 4.7 Python Project Structure

```text
my-mcp-server/
│
├── .venv/
├── server.py
└── requirements.txt
```

Create requirements:

```bash
pip freeze > requirements.txt
```

---

## 4.8 Run Python MCP Server

```bash
python server.py
```

The exact command and transport depend on how your server is configured.

For stdio-based MCP servers, the process is normally started by the MCP host rather than manually interacted with through a normal terminal.

---

# 5. TypeScript Installation

TypeScript MCP development generally uses Node.js and npm.

---

## 5.1 Install Node.js

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Use a currently supported Node.js release compatible with the MCP TypeScript SDK version you are using.

---

## 5.2 Create TypeScript Project

```bash
mkdir my-mcp-server-ts
cd my-mcp-server-ts
```

Initialize npm:

```bash
npm init -y
```

---

## 5.3 Install TypeScript

```bash
npm install -D typescript
```

Create TypeScript configuration:

```bash
npx tsc --init
```

---

## 5.4 Install MCP TypeScript SDK

Install the MCP SDK package appropriate for your project:

```bash
npm install @modelcontextprotocol/sdk
```

---

## 5.5 Install Development Tools

A typical TypeScript project may use:

```bash
npm install -D tsx
```

Then you can run TypeScript directly during development:

```bash
npx tsx src/index.ts
```

---

## 5.6 TypeScript Project Structure

```text
my-mcp-server-ts/
│
├── node_modules/
├── src/
│   └── index.ts
│
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## 5.7 Example TypeScript MCP Server

A server can be structured around the MCP TypeScript SDK.

Example pattern:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "My MCP Server",
  version: "1.0.0",
});

server.tool(
  "add_numbers",
  "Add two numbers",
  {
    a: {
      type: "number",
    },
    b: {
      type: "number",
    },
  },
  async ({ a, b }) => {
    return {
      content: [
        {
          type: "text",
          text: String(a + b),
        },
      ],
    };
  }
);
```

The exact SDK APIs can change between SDK releases, so use the documentation for the installed version when implementing production code.

---

# 6. Docker Installation

Docker allows an MCP server and its dependencies to be packaged into a reproducible container.

---

## 6.1 Check Docker

Run:

```bash
docker --version
```

Check Docker Compose:

```bash
docker compose version
```

---

## 6.2 Docker Architecture

```text
MCP Server Source Code
        |
        v
    Dockerfile
        |
        v
   Docker Image
        |
        v
 Docker Container
        |
        v
    MCP Server
```

---

## 6.3 Python MCP Dockerfile

Example:

```dockerfile
FROM python:3-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

CMD ["python", "server.py"]
```

---

## 6.4 Build Image

```bash
docker build -t my-mcp-server .
```

---

## 6.5 Run Container

```bash
docker run --rm my-mcp-server
```

For MCP deployments, the container's transport configuration must match the MCP host/client configuration.

---

## 6.6 Docker Project Structure

```text
my-mcp-server/
│
├── server.py
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

Example `.dockerignore`:

```text
.venv
__pycache__
.git
.env
```

---

# 7. VS Code Setup

Visual Studio Code can be used as the main MCP development environment.

---

## 7.1 Install VS Code

Install VS Code and open your MCP project.

Open a project:

```bash
code .
```

---

## 7.2 Recommended Extensions

Depending on your project, useful extensions include:

```text
Python
Pylance
ESLint
Prettier
Docker
GitLens
```

Only install extensions required for your workflow.

---

## 7.3 Python Environment in VS Code

Open:

```text
Command Palette
```

Then:

```text
Python: Select Interpreter
```

Select:

```text
.venv
```

Your terminal should then use the virtual environment.

---

## 7.4 VS Code MCP Configuration

Recent VS Code releases can support MCP configuration and MCP-aware workflows.

A project can contain MCP configuration depending on the VS Code feature/version being used.

A conceptual configuration looks like:

```json
{
  "servers": {
    "my-server": {
      "command": "python",
      "args": [
        "server.py"
      ]
    }
  }
}
```

The exact configuration location and schema can vary by VS Code version.

Always use the MCP configuration format supported by your installed VS Code release.

---

## 7.5 VS Code Flow

```text
VS Code
   |
   v
MCP Project
   |
   +---- Python / TypeScript
   |
   +---- MCP SDK
   |
   +---- Configuration
   |
   v
MCP Server
```

---

# 8. Claude Desktop Setup

Claude Desktop can act as an MCP host for locally configured MCP servers.

---

## 8.1 Install Claude Desktop

Install the current Claude Desktop application for your operating system.

After installation:

```text
Claude Desktop
       |
       v
MCP Configuration
       |
       v
MCP Server
```

---

## 8.2 MCP Server Configuration

A typical local MCP server configuration contains:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": [
        "C:\\path\\to\\server.py"
      ]
    }
  }
}
```

For a virtual environment, you can point the command to the appropriate Python executable.

Example Windows concept:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "C:\\path\\to\\project\\.venv\\Scripts\\python.exe",
      "args": [
        "C:\\path\\to\\project\\server.py"
      ]
    }
  }
}
```

The configuration file location can vary by operating system and current Claude Desktop release.

---

## 8.3 Claude Desktop Flow

```text
Claude Desktop
      |
      v
MCP Configuration
      |
      v
Start MCP Server
      |
      v
MCP Client
      |
      v
MCP Server
      |
      +---- Tools
      +---- Resources
      +---- Prompts
```

---

## 8.4 Testing

After configuring the server:

```text
Open Claude Desktop
        |
        v
Load MCP Configuration
        |
        v
Start MCP Server
        |
        v
Check Available Tools
        |
        v
Call Tool
        |
        v
Verify Result
```

If the server does not appear, check:

```text
Configuration path
Command path
Python environment
Node.js path
Server startup errors
Permissions
Logs
```

---

# 9. Cursor Setup

Cursor can be used as an MCP-aware development environment.

---

## 9.1 Install Cursor

Install Cursor and open your project.

```text
Cursor
   |
   v
MCP Configuration
   |
   v
MCP Server
```

---

## 9.2 Configure MCP Server

Cursor supports MCP configuration through its MCP settings/configuration mechanism.

A conceptual configuration is:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "python",
      "args": [
        "/path/to/server.py"
      ]
    }
  }
}
```

The exact configuration file location and supported options can change between Cursor releases.

---

## 9.3 Cursor Flow

```text
Cursor
   |
   v
MCP Configuration
   |
   v
MCP Client
   |
   v
MCP Server
   |
   +---- Tool
   +---- Resource
   +---- Prompt
```

---

## 9.4 Testing

```text
Open Cursor
    |
    v
Open MCP Settings
    |
    v
Configure Server
    |
    v
Start / Reload MCP
    |
    v
Check Server Status
    |
    v
Call MCP Tool
```

---

# 10. OpenAI Setup

OpenAI applications can use MCP as part of an application architecture when the relevant OpenAI API/product capability supports MCP or remote tool integrations.

A conceptual architecture is:

```text
User
  |
  v
Application
  |
  v
OpenAI Model
  |
  v
MCP Integration
  |
  v
MCP Server
  |
  +---- Tool
  +---- Resource
  +---- Prompt
```

---

## 10.1 OpenAI + MCP Architecture

```text
                   USER
                     |
                     v
                APPLICATION
                     |
                     v
                OPENAI API
                     |
                     v
               MODEL / AGENT
                     |
                     v
               MCP INTEGRATION
                     |
                     v
                 MCP SERVER
                     |
          +----------+----------+
          |          |          |
          v          v          v
        TOOLS    RESOURCES   PROMPTS
```

---

## 10.2 Remote MCP Concept

For a remote MCP server:

```text
Client Application
       |
       v
OpenAI API / Model
       |
       v
Remote MCP Server
       |
       v
External Services
```

Security is important when connecting remote MCP servers.

Consider:

```text
Authentication
Authorization
TLS
Secrets Management
Tool Permissions
Data Access
Audit Logging
```

---

## 10.3 OpenAI Development Flow

```text
Create MCP Server
       |
       v
Expose MCP Endpoint
       |
       v
Configure Supported OpenAI Integration
       |
       v
Authenticate
       |
       v
Connect
       |
       v
Discover Tools
       |
       v
Invoke Tool
       |
       v
Receive Result
```

The exact API fields and configuration depend on the OpenAI product/API capability being used.

---

# 11. Environment Variables

MCP applications commonly require environment variables.

Example:

```text
API_KEY
DATABASE_URL
OPENAI_API_KEY
GITHUB_TOKEN
```

Do not hard-code secrets in source code.

Bad:

```python
API_KEY = "my-secret-key"
```

Better:

```python
import os

API_KEY = os.getenv("API_KEY")
```

---

## 11.1 `.env`

A local `.env` file may contain:

```text
API_KEY=your-secret
DATABASE_URL=your-database-url
```

Add it to `.gitignore`:

```text
.env
```

---

# 12. Project Structure

A recommended learning project:

```text
mcp-project/
│
├── 01-basic-server/
│   ├── server.py
│   └── requirements.txt
│
├── 02-tools/
│   ├── server.py
│   └── requirements.txt
│
├── 03-resources/
│   ├── server.py
│   └── requirements.txt
│
├── 04-prompts/
│   ├── server.py
│   └── requirements.txt
│
├── 05-logging/
│   ├── server.py
│   └── README.md
│
├── Dockerfile
├── .gitignore
└── README.md
```

---

# 13. Running an MCP Server

The general execution flow is:

```text
Source Code
    |
    v
Install Dependencies
    |
    v
Configure Environment
    |
    v
Start MCP Server
    |
    v
MCP Transport
    |
    v
MCP Client
```

For Python:

```bash
python server.py
```

For TypeScript:

```bash
npx tsx src/index.ts
```

For Docker:

```bash
docker build -t my-mcp-server .
docker run --rm my-mcp-server
```

---

# 14. Testing MCP Installation

Use the following checklist.

## Python

```bash
python --version
pip --version
pip show mcp
```

---

## TypeScript

```bash
node --version
npm --version
npm list @modelcontextprotocol/sdk
```

---

## Docker

```bash
docker --version
docker compose version
```

---

## MCP Server

Verify:

```text
Server starts
       |
       v
Transport works
       |
       v
Client connects
       |
       v
Tools are discovered
       |
       v
Tool executes
       |
       v
Result is returned
```

---

# 15. Troubleshooting

## Problem 1: `python` command not found

Check:

```bash
python --version
```

If unavailable, verify Python installation and PATH configuration.

On some systems use:

```bash
python3 --version
```

---

## Problem 2: `pip install mcp` fails

Try:

```bash
python -m pip install --upgrade pip
```

Then:

```bash
python -m pip install mcp
```

Make sure the correct virtual environment is active.

---

## Problem 3: Node.js not found

Check:

```bash
node --version
```

If unavailable, install Node.js and restart the terminal.

---

## Problem 4: MCP SDK import error

Python example:

```text
ModuleNotFoundError
```

Check:

```bash
pip show mcp
```

Also verify that the correct Python interpreter is being used.

---

## Problem 5: Claude Desktop cannot start server

Check:

```text
Python executable path
Server path
Virtual environment
Dependencies
Configuration syntax
Environment variables
Server logs
```

---

## Problem 6: Cursor cannot connect

Check:

```text
MCP configuration
Command
Arguments
Working directory
Environment variables
Server logs
```

---

## Problem 7: Docker container exits

Check:

```bash
docker ps -a
```

Then:

```bash
docker logs <container>
```

Verify the container command:

```dockerfile
CMD ["python", "server.py"]
```

---

## Problem 8: stdio server behaves strangely

Do not write application logs to stdout.

Incorrect:

```python
print("Server started")
```

For a stdio MCP server, prefer logging to stderr.

Conceptually:

```text
MCP Messages
    |
    v
stdout

Application Logs
    |
    v
stderr
```

---

# 16. Installation Checklist

## Development Tools

```text
[ ] Git installed
[ ] Python installed
[ ] Node.js installed
[ ] npm installed
[ ] Docker installed
[ ] VS Code installed
```

---

## Python

```text
[ ] Virtual environment created
[ ] Virtual environment activated
[ ] MCP SDK installed
[ ] Python MCP server created
[ ] Server tested
```

---

## TypeScript

```text
[ ] Node.js installed
[ ] npm project created
[ ] TypeScript installed
[ ] MCP SDK installed
[ ] TypeScript server created
[ ] Server tested
```

---

## Docker

```text
[ ] Docker installed
[ ] Dockerfile created
[ ] Image built
[ ] Container started
[ ] Container logs checked
```

---

## VS Code

```text
[ ] Project opened
[ ] Correct interpreter selected
[ ] Required extensions installed
[ ] MCP configuration tested
```

---

## Claude Desktop

```text
[ ] Claude Desktop installed
[ ] MCP server configured
[ ] Server starts successfully
[ ] Tools discovered
[ ] Tool tested
```

---

## Cursor

```text
[ ] Cursor installed
[ ] Project opened
[ ] MCP server configured
[ ] MCP server connected
[ ] Tools discovered
[ ] Tool tested
```

---

## OpenAI

```text
[ ] OpenAI application created
[ ] MCP capability verified for the selected API/product
[ ] MCP server configured
[ ] Authentication configured
[ ] Remote endpoint secured
[ ] Tool access tested
```

---

# 17. Final Summary

The complete Module 4 installation path is:

```text
                     MCP INSTALLATION
                            |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
      Python            TypeScript            Docker
        |                   |                   |
        v                   v                   v
     MCP SDK             MCP SDK            Container
        |                   |                   |
        +-------------------+-------------------+
                            |
                            v
                    DEVELOPMENT TOOLS
                            |
                     +------+------+
                     |             |
                     v             v
                   VS Code       Cursor
                     |
                     v
                MCP Server
                     |
          +----------+----------+
          |          |           |
          v          v           v
       Claude      Cursor      OpenAI
      Desktop      Client    Integration
          |          |           |
          +----------+-----------+
                     |
                     v
                MCP Server
                     |
                     v
              Tools / Resources
                  / Prompts
```

---

# Key Takeaways

1. **Python** can be used to build MCP servers with the Python SDK.

2. **TypeScript** can be used to build MCP servers with the TypeScript SDK.

3. **Docker** provides a reproducible environment for packaging and running MCP servers.

4. **VS Code** provides a general development environment for MCP projects.

5. **Claude Desktop** can act as an MCP host for locally configured servers.

6. **Cursor** provides MCP-aware AI development workflows.

7. **OpenAI** can participate in MCP-based architectures when the selected OpenAI API/product supports the required MCP integration.

8. Always keep secrets outside source code.

9. For stdio MCP servers, keep stdout reserved for protocol communication and use stderr for operational logging.

10. Always verify the exact configuration syntax and API capabilities for the current version of the MCP client, SDK, IDE, or API you are using.

---

# Module 4 Completion Flow

```text
INSTALL TOOLS
      |
      v
SET UP PYTHON
      |
      v
SET UP TYPESCRIPT
      |
      v
SET UP DOCKER
      |
      v
CONFIGURE VS CODE
      |
      v
CONFIGURE CLAUDE DESKTOP
      |
      v
CONFIGURE CURSOR
      |
      v
CONFIGURE OPENAI INTEGRATION
      |
      v
CREATE MCP SERVER
      |
      v
CONNECT MCP CLIENT
      |
      v
DISCOVER TOOLS
      |
      v
CALL TOOL
      |
      v
VERIFY RESULT
      |
      v
       MCP READY
```

> **Module 4 Goal:** After completing this module, you should have a working MCP development environment and understand how Python, TypeScript, Docker, VS Code, Claude Desktop, Cursor, and OpenAI-based applications fit into the MCP ecosystem.
