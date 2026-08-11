# Module 7 — MCP Tools

This module contains practical implementations of MCP (Model Context Protocol) Tools.

Each tool is implemented as an independent MCP Server and demonstrates how an MCP
Client can discover and execute tools.

---

## Tools Covered

| # | Tool | Purpose |
|---|------|---------|
| 01 | Calculator | Mathematical calculations |
| 02 | Weather | Get weather information |
| 03 | Filesystem | Read and manage files |
| 04 | SQLite | Database operations |
| 05 | GitHub | GitHub repository operations |
| 06 | Email | Send and manage emails |
| 07 | Slack | Send messages and interact with Slack |
| 08 | Notion | Manage Notion pages and databases |
| 09 | Google Drive | Manage files in Google Drive |
| 10 | Calendar | Create and manage calendar events |

---

## Repository Structure

```text
07-Tools/
│
├── README.md
│
├── 01-Calculator/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 02-Weather/
│   ├── Python/
│   │   ├── server.py
│   │   └── requirements.txt
│   └── TypeScript/
│       ├── server.ts
│       └── package.json
│
├── 03-Filesystem/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 04-SQLite/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 05-GitHub/
│   ├── Python/
│   │   ├── server.py
│   │   └── requirements.txt
│   └── TypeScript/
│       ├── server.ts
│       └── package.json
│
├── 06-Email/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 07-Slack/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 08-Notion/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
├── 09-Google-Drive/
│   ├── Python/
│   │   └── server.py
│   └── TypeScript/
│       └── server.ts
│
└── 10-Calendar/
    ├── Python/
    │   └── server.py
    └── TypeScript/
        └── server.ts