# AI Tool Calling

> **AI Tool Calling** (also known as **Function Calling** or **Tool Use**) is a mechanism that allows a Large Language Model (LLM) to interact with external tools, APIs, databases, applications, or services to perform tasks beyond its built-in knowledge. Instead of only generating text, the AI can decide **when** to use a tool, **which** tool to use, **what parameters** to provide, and **how** to incorporate the returned results into its response.

Tool Calling is one of the most important capabilities in modern AI systems because it transforms an LLM from a passive chatbot into an active assistant capable of performing real-world tasks.

---

# Why Do AI Models Need Tool Calling?

Large Language Models are trained on massive datasets and excel at generating human-like text. However, they have several limitations:

- They cannot access live data by themselves.
- They cannot read files from your computer.
- They cannot execute code.
- They cannot query databases.
- They cannot send emails.
- They cannot interact with cloud services.
- Their knowledge is limited to the data they were trained on.

For example, consider the question:

> **"What is the current weather in Mumbai?"**

A language model cannot know the current weather because it changes continuously.

Instead, the AI must:

1. Recognize that weather information is required.
2. Call a weather API.
3. Receive the latest weather data.
4. Generate a natural language response.

This process is known as **Tool Calling**.

---

# Understanding Tool Calling

Think of an AI model as a highly intelligent employee.

The employee knows **how to think**, but does not have direct access to company systems.

When information is needed, the employee asks another system.

Example:

```text
Customer
   │
   ▼
AI Assistant
   │
   ▼
Weather API
   │
   ▼
Returns Weather Data
   │
   ▼
AI Assistant
   │
   ▼
Customer
```

The AI is responsible for reasoning.

The external tool is responsible for performing the actual work.

---

# What is a Tool?

A **Tool** is any external capability that an AI model can invoke.

Examples include:

- Weather API
- GitHub API
- SQL Database
- Local File System
- Calculator
- Search Engine
- Email Service
- Calendar
- Terminal
- Python Code Execution

A tool allows the AI to interact with the real world instead of relying solely on its training data.

---

# Common Types of AI Tools

| Tool | Purpose |
|-------|----------|
| Calculator | Mathematical calculations |
| Weather API | Live weather information |
| SQL Database | Query business data |
| GitHub | Manage repositories |
| Slack | Send messages |
| File System | Read and write files |
| Search Engine | Retrieve web information |
| Email Service | Send emails |
| Calendar | Schedule events |
| Payment API | Process transactions |

---

# How Tool Calling Works

The Tool Calling process consists of several steps.

```text
          User
            │
            ▼
      AI Application
            │
            ▼
Large Language Model
            │
            ▼
Chooses Tool
            │
            ▼
Execute Tool
            │
            ▼
External Service
            │
            ▼
Return Result
            │
            ▼
Large Language Model
            │
            ▼
     Final Response
```

The AI does not directly perform the task.

Instead, it delegates the task to the appropriate external tool.

---

# Tool Calling Workflow

Suppose a user asks:

> **"What is the current weather in Mumbai?"**

The workflow looks like this:

### Step 1 — User Request

```text
User

"What is the weather in Mumbai?"
```

↓

### Step 2 — AI Understands the Question

The LLM recognizes that weather information is required.

↓

### Step 3 — Tool Selection

The model decides to use the Weather Tool.

↓

### Step 4 — Generate Tool Call

Instead of answering immediately, the model generates:

```json
{
  "tool": "get_weather",
  "city": "Mumbai"
}
```

↓

### Step 5 — Execute Tool

The application sends the request to the Weather API.

↓

### Step 6 — Tool Returns Result

```json
{
  "temperature": 30,
  "condition": "Cloudy"
}
```

↓

### Step 7 — AI Generates Response

The model combines the tool output with natural language.

Final Answer:

> "The current temperature in Mumbai is **30°C** with cloudy skies."

---

# Example: GitHub Tool

User asks:

> "Show my open pull requests."

The AI cannot know this information.

Instead it generates:

```json
{
  "tool": "list_pull_requests",
  "status": "open"
}
```

The GitHub API returns:

```json
[
    {
        "title": "Fix Login Bug"
    },
    {
        "title": "Update Documentation"
    }
]
```

The AI responds:

> You currently have two open pull requests:
>
> • Fix Login Bug
>
> • Update Documentation

---

# Example: SQL Database

User asks:

> "How many customers registered today?"

The AI generates:

```json
{
    "tool": "execute_sql",
    "query": "SELECT COUNT(*) FROM customers WHERE DATE(created_at)=CURRENT_DATE;"
}
```

Database returns:

```text
142
```

Final response:

> There are **142 customers** registered today.

---

# Components of Tool Calling

Tool Calling consists of four major components.

## 1. User Request

The user provides a natural language instruction.

Example:

```
Show today's sales.
```

---

## 2. Language Model

The LLM determines:

- Is a tool required?
- Which tool should be used?
- What parameters are needed?

---

## 3. Tool Execution

The application executes the selected tool.

Examples:

- Database query
- API request
- File access
- Code execution

---

## 4. Response Generation

The LLM converts structured tool output into a natural language response.

---

# Tool Calling Without MCP

Before MCP, every AI platform had its own Tool Calling implementation.

Example:

```text
OpenAI
   │
Custom Function Format

Anthropic
   │
Different Tool Format

Gemini
   │
Another Tool Format
```

Developers had to create different tool definitions for every AI provider.

This increased development complexity.

---

# Tool Calling With MCP

MCP standardizes Tool Calling.

```text
User
 │
 ▼
Host
 │
 ▼
MCP Client
 │
 ▼
tools/list
 │
 ▼
MCP Server
 │
 ▼
Available Tools
```

The AI discovers tools automatically.

No vendor-specific implementation is required.

---

# MCP Tool Discovery

Instead of hardcoding tools, MCP Clients ask the server:

```json
{
  "method": "tools/list"
}
```

Server responds:

```json
{
  "tools": [
    {
      "name": "read_file",
      "description": "Read a local file"
    },
    {
      "name": "execute_sql",
      "description": "Execute SQL query"
    }
  ]
}
```

The model now knows what tools are available.

---

# MCP Tool Execution

When the AI decides to use a tool, the client sends:

```json
{
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "README.md"
    }
  }
}
```

The MCP Server executes the tool.

---

# Server Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "# Welcome to MCP"
    }
  ]
}
```

The Host provides this result to the LLM.

The LLM generates the final answer.

---

# Complete MCP Tool Calling Flow

```text
User
 │
 ▼
Host
 │
 ▼
Large Language Model
 │
 ▼
tools/list
 │
 ▼
MCP Server
 │
 ▼
Available Tools
 │
 ▼
LLM chooses Tool
 │
 ▼
tools/call
 │
 ▼
MCP Server
 │
 ▼
External API
 │
 ▼
Result
 │
 ▼
Host
 │
 ▼
LLM
 │
 ▼
User
```

---

# Advantages of MCP Tool Calling

## Standardized

One protocol for every tool.

---

## Dynamic Discovery

Tools are discovered automatically.

---

## Secure

Credentials remain inside the MCP Server.

---

## Reusable

One MCP Server can be used by multiple AI applications.

---

## Extensible

Adding a new tool does not require changing the AI application.

---

## Vendor Independent

Works across different MCP-compatible hosts.

---

# Real-World Applications

AI Tool Calling powers many modern AI assistants.

Examples include:

- Code generation
- GitHub automation
- SQL assistants
- Customer support bots
- Calendar management
- Document summarization
- Cloud infrastructure management
- File management
- Data analysis
- DevOps automation

---

# Tool Calling vs MCP Tool Calling

| Traditional Tool Calling | MCP Tool Calling |
|--------------------------|------------------|
| Platform-specific | Standardized |
| Hardcoded tool definitions | Dynamic tool discovery |
| Limited interoperability | Cross-platform compatibility |
| Duplicate integrations | Reusable MCP Servers |
| Vendor lock-in | Open standard |

---

# Key Takeaways

- **AI Tool Calling** enables Large Language Models to interact with external systems and perform real-world tasks.
- The AI decides **when** to call a tool, **which** tool to use, and **what parameters** to send.
- Tools can include APIs, databases, file systems, calculators, cloud services, and more.
- Before MCP, every AI platform implemented Tool Calling differently.
- **Model Context Protocol (MCP)** standardizes Tool Calling by providing a common protocol for **tool discovery**, **tool execution**, and **response handling**.
- MCP makes AI applications more secure, scalable, reusable, and interoperable.

---

# What's Next?

Now that you understand **AI Tool Calling** and how MCP standardizes it, the next step is to explore **AI Agents & MCP**, where you'll learn how autonomous AI agents use reasoning, planning, memory, and MCP tools to perform complex multi-step tasks.