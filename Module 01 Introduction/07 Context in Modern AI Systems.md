# Context in Modern AI Systems

> **Context** is the information provided to a Large Language Model (LLM) before it generates a response. It represents everything the model knows **at the moment of inference**, including system instructions, conversation history, user input, retrieved documents, tool outputs, and external resources. The quality and relevance of this context directly determine the quality of the model's responses.

In modern AI systems, context is far more important than model size alone. Even the most advanced AI model cannot provide accurate answers if it lacks the necessary information. Conversely, a well-designed context enables the model to reason accurately, answer questions reliably, and perform complex tasks.

The **Model Context Protocol (MCP)** standardizes how this context is discovered, shared, updated, and delivered between AI applications and external systems.

---

# What is Context?

Context refers to **all the information available to an AI model during a conversation or task**.

Think of context as the model's **working memory**.

When you ask a question, the model does not search its entire training dataset. Instead, it only considers the information currently available in its **context window**.

For example:

```text
System Prompt
      │
Conversation History
      │
User Message
      │
Retrieved Documents
      │
Tool Outputs
      │
Current Environment
      │
      ▼
Large Language Model
```

Everything above forms the model's context.

---

# Why is Context Important?

Without context, AI models become unreliable.

For example:

User:

> What is the capital?

The AI cannot answer because it lacks context.

Now consider:

User:

> India is the seventh-largest country in the world.

> What is the capital?

Now the model understands that "capital" refers to **India**.

Context enables the AI to understand:

- Previous conversation
- User intent
- Relationships between topics
- Current environment
- External information

---

# Understanding the Context Window

Every Large Language Model has a **Context Window**, which is the maximum amount of information it can process at one time.

The context window includes:

- System Instructions
- Previous Messages
- Current User Prompt
- Retrieved Documents
- Tool Outputs
- Images (for multimodal models)

Example:

```text
+--------------------------------------+
| System Prompt                        |
|--------------------------------------|
| Previous Conversation                |
|--------------------------------------|
| User Message                         |
|--------------------------------------|
| Retrieved Knowledge                  |
|--------------------------------------|
| Tool Results                         |
+--------------------------------------+
            │
            ▼
         LLM Response
```

Once the context window is full, older information may be removed or summarized to make room for new content.

---

# Types of Context

Modern AI systems use multiple types of context simultaneously.

---

# 1. System Context

System Context defines the model's behavior.

It includes:

- Role
- Instructions
- Rules
- Safety Guidelines
- Personality

Example:

```text
You are an experienced software engineer.
Always explain concepts with examples.
Respond using Markdown.
```

The system prompt influences every response.

---

# 2. User Context

User Context includes information provided by the user.

Examples:

- Current question
- User preferences
- Uploaded files
- Goals
- Requirements

Example:

```
Create a REST API using FastAPI.
```

---

# 3. Conversation Context

Conversation Context consists of previous messages exchanged between the user and the AI.

Example:

```
User:
Explain Python.

Assistant:
Python is a programming language.

User:
Show me an example.
```

The model understands that "example" refers to Python.

---

# 4. Retrieved Context (RAG)

Retrieved Context comes from external knowledge sources.

Instead of relying only on training data, the AI retrieves relevant information before generating a response.

Sources include:

- PDFs
- Documentation
- Company Knowledge Base
- Database Records
- Search Results
- Vector Databases

Example:

```text
User
 │
 ▼
Search Vector Database
 │
 ▼
Retrieve Documents
 │
 ▼
LLM
 │
 ▼
Response
```

This technique is called **Retrieval-Augmented Generation (RAG)**.

---

# 5. Tool Context

When AI executes tools, their outputs become part of the context.

Example:

User:

```
Show my latest GitHub issues.
```

The GitHub MCP Server returns:

```json
[
    {
        "title":"Fix Login Bug"
    }
]
```

The returned JSON becomes context for the LLM.

---

# 6. Environment Context

Environment Context contains information about the current execution environment.

Examples:

- Operating System
- Current Directory
- Running Processes
- Open Files
- Installed Packages
- Active Git Branch

Example:

```
Current Directory

/home/project

Git Branch

feature/login
```

This allows AI coding assistants to understand the current project.

---

# 7. Memory Context

Modern AI systems often include memory.

Memory stores information beyond the current conversation.

Examples:

- User Preferences
- Previous Projects
- Coding Style
- Frequently Used Tools

Unlike conversation history, memory can persist across multiple sessions.

---

# How Context is Used

Suppose a user asks:

> Fix the login bug.

The AI requires several kinds of context.

```text
User Request
      │
      ▼
Conversation History
      │
      ▼
Current Source Code
      │
      ▼
Git Repository
      │
      ▼
Error Logs
      │
      ▼
Build Status
      │
      ▼
Generate Solution
```

Without these contextual inputs, the AI cannot solve the problem accurately.

---

# Challenges Without Proper Context

Without sufficient context, AI models may:

- Hallucinate facts
- Lose conversation history
- Misunderstand user intent
- Produce incorrect code
- Give outdated information
- Make inconsistent decisions

For example:

User:

> Fix the bug.

Without additional context, the AI does not know:

- Which project?
- Which file?
- Which bug?
- Which programming language?

---

# How MCP Improves Context Management

One of MCP's primary goals is to standardize context sharing.

Instead of embedding large amounts of text into prompts, MCP provides structured access to external resources.

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
Resources
 │
 ▼
LLM
```

The Host retrieves only the information needed for the current task.

---

# Resources in MCP

In MCP, **Resources** are structured pieces of information that provide context to the AI.

Examples include:

- Local Files
- Documentation
- Database Records
- API Responses
- Logs
- Configuration Files

Unlike tools, resources are generally **read-only**.

They help the AI understand the current situation before deciding what actions to take.

---

# Dynamic Context Injection

Traditional AI systems rely on manually crafted prompts.

Example:

```text
Paste the document here.

Paste logs here.

Paste source code here.
```

This approach is inefficient.

MCP introduces **Dynamic Context Injection**, allowing the AI to retrieve information only when needed.

Workflow:

```text
User
 │
 ▼
Need Context?
 │
 ▼
Request Resource
 │
 ▼
MCP Server
 │
 ▼
Retrieve Data
 │
 ▼
Return Context
 │
 ▼
LLM
```

This reduces prompt size and ensures the AI always works with the most recent information.

---

# Context Notifications

Information in external systems changes frequently.

For example:

- Files are edited
- Database records are updated
- Git commits are pushed
- Slack messages arrive

MCP supports **Context Notifications**, allowing servers to notify the Host when important resources change.

Example:

```text
File Modified
      │
      ▼
Filesystem MCP Server
      │
      ▼
Notification
      │
      ▼
Host
      │
      ▼
Update Context
```

The AI always works with up-to-date information.

---

# Context Flow in MCP

The following diagram illustrates how context flows through an MCP-enabled AI application.

```text
User
 │
 ▼
Host
 │
 ▼
Conversation Context
 │
 ▼
Retrieve Resources
 │
 ▼
MCP Server
 │
 ▼
Files
Database
API
Logs
 │
 ▼
Return Context
 │
 ▼
LLM
 │
 ▼
Response
```

---

# Benefits of MCP Context Management

## Standardized Context

Every MCP Server exposes context in a consistent format.

---

## Real-Time Information

AI receives live data instead of relying on outdated training knowledge.

---

## Smaller Prompts

Only relevant information is retrieved.

This improves efficiency.

---

## Better Accuracy

Responses are grounded in real-world data.

Hallucinations are reduced.

---

## Improved Security

Sensitive information remains inside MCP Servers.

Only necessary data is shared.

---

## Better Scalability

AI applications can retrieve context from multiple systems simultaneously.

---

# Real-World Examples

### AI Coding Assistant

Context Sources:

- Source Code
- Git Repository
- Terminal Output
- Documentation

---

### Customer Support Bot

Context Sources:

- Customer Database
- Previous Tickets
- Knowledge Base
- Product Documentation

---

### Business Analytics Agent

Context Sources:

- SQL Database
- Dashboards
- Reports
- Spreadsheets

---

### Healthcare Assistant

Context Sources:

- Patient Records
- Medical Guidelines
- Lab Reports
- Hospital Database

---

# Traditional Context vs MCP Context

| Traditional AI | MCP-Based AI |
|----------------|--------------|
| Manual prompt engineering | Dynamic context retrieval |
| Static information | Real-time information |
| Large prompts | Efficient resource loading |
| Limited external access | Standardized resource access |
| Hardcoded integrations | Dynamic resource discovery |
| Difficult maintenance | Reusable MCP Servers |

---

# Key Takeaways

- **Context** is all the information an AI model uses to generate a response.
- Modern AI systems rely on multiple types of context, including **system prompts**, **user input**, **conversation history**, **retrieved knowledge**, **tool outputs**, **environment details**, and **memory**.
- The **context window** determines how much information the model can process at one time.
- Proper context improves accuracy, relevance, and reasoning while reducing hallucinations.
- MCP standardizes how AI applications retrieve, manage, and update context through **Resources**, **Dynamic Context Injection**, and **Context Notifications**.
- By delivering only the information needed at the right time, MCP enables AI systems to build more intelligent, scalable, and reliable applications.

---

# What's Next?

Now that you understand how **context** powers modern AI systems and how **MCP standardizes context management**, the next topic is **Official Resources**, where you'll explore the official MCP documentation, SDKs, reference implementations, and community projects to continue your learning journey.