# Module 6 — MCP Client

The MCP Client is the component responsible for establishing and managing
communication between an MCP Host and an MCP Server.

The client acts as a bridge between the host application and MCP servers.

## What You Will Learn

In this module, you will learn:

- What is an MCP Client?
- Why MCP Clients are required
- How a client connects to an MCP Server
- How a client discovers available tools
- How a client executes tools
- How a client receives tool responses
- Complete MCP Client lifecycle
- Client architecture
- Client communication flow
- Python implementation
- Node.js implementation

## MCP Client Responsibilities

An MCP Client mainly performs four important operations:

1. Connect
2. Discover Tools
3. Execute Tools
4. Receive Response

## Basic Lifecycle

```text
              MCP HOST
                  │
                  ▼
             MCP CLIENT
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
     Connect   Discover   Execute
                  Tools      Tools
                    │         │
                    └────┬────┘
                         ▼
                  Receive Response
                         │
                         ▼
                    MCP CLIENT
                         │
                         ▼
                      HOST