# MCP Resources — Theory

## 1. Introduction

In the Model Context Protocol (MCP), **Resources** are one of the core primitives used to provide data and contextual information to AI applications.

Resources allow an **MCP Server** to expose read-only information that an **MCP Client** can retrieve and provide to an LLM.

The exposed information can be a simple text document, configuration file, database record, API response, image, log file, or any other piece of data that can be represented through a URI.

Resources are primarily intended for **reading and consuming information**, rather than performing actions.

Examples of resources include:

- Markdown documentation
- JSON configuration files
- CSV datasets
- Images
- PDF documents
- Application logs
- Database records
- API responses
- Source code
- Reports
- Knowledge-base documents

The main idea is:

> **Resources provide information, while Tools perform actions.**

---

## 2. What is an MCP Resource?

An **MCP Resource** is a piece of structured or unstructured data exposed by an MCP Server and identified by a unique **URI (Uniform Resource Identifier)**.

For example:

```text
file://docs/readme.md
```

Another example:

```text
file://config/application.json
```

Another example:

```text
database://users/402
```

A resource can contain different types of information.

### Unstructured Data

Examples:

- Markdown documents
- Plain text
- Documentation
- Logs
- Source code
- Configuration files

Example:

```text
file://docs/introduction.md
```

### Structured Data

Examples:

- JSON
- CSV
- XML
- Database records
- API responses

Example:

```text
database://users/402
```

### Binary Data

Examples:

- PNG images
- JPEG images
- PDF documents
- Audio files
- Other binary objects

Example:

```text
file://images/architecture.png
```

---

## 3. Why are Resources Important?

LLMs require context to generate useful and accurate responses.

An LLM may not have access to an organization's private documentation, databases, configuration files, reports, or other external information.

MCP Resources provide a standardized way to make this information available to an MCP Client and ultimately to the LLM.

For example, suppose an organization has:

```text
company/
├── documentation/
│   ├── introduction.md
│   ├── architecture.md
│   └── api.md
│
├── configuration/
│   └── application.json
│
└── data/
    └── customers.csv
```

An MCP Server can expose these files as resources.

The client can discover resources such as:

```text
file://documentation/introduction.md
file://documentation/architecture.md
file://documentation/api.md
file://configuration/application.json
file://data/customers.csv
```

The LLM can then use the appropriate resource when additional context is required.

The general flow is:

```text
External Data
     │
     ▼
MCP Resource
     │
     ▼
MCP Server
     │
     ▼
MCP Client
     │
     ▼
LLM Context
     │
     ▼
AI Response
```

---

## 4. Resources vs Tools

Resources and Tools are both important MCP primitives, but they have different purposes.

### Resources

Resources are primarily used to **provide information**.

Examples:

- Read documentation
- Read a configuration file
- Read a database record
- Read a CSV file
- Read an image
- Read a report

### Tools

Tools are primarily used to **perform actions**.

Examples:

- Send an email
- Create a GitHub issue
- Update a database
- Create a calendar event
- Send a Slack message
- Delete a file

The conceptual difference is:

```text
RESOURCE
    │
    └── Provides Information
            │
            ▼
           READ


TOOL
    │
    └── Performs Action
            │
            ▼
         EXECUTE
```

Comparison:

| Feature | Resource | Tool |
|---|---|---|
| Primary purpose | Provide data | Perform actions |
| Typical operation | Read | Execute |
| Main role | Context | Action |
| Example | Read Markdown | Send Email |
| Example | Read JSON | Create GitHub Issue |
| Example | Read database record | Update database |
| Example | Read image | Create calendar event |

A simple rule is:

> **If the operation primarily provides information, use a Resource. If the operation performs an action, use a Tool.**

---

## 5. Resource URI

Every resource is identified by a URI.

URI stands for:

**Uniform Resource Identifier**

Example:

```text
file://docs/readme.md
```

Another example:

```text
database://users/402
```

Another example:

```text
api://weather/pune
```

The URI allows the MCP Client to identify a specific resource.

For example:

```text
file://docs/readme.md
file://docs/api.md
file://docs/architecture.md
```

represent three different resources.

A good resource URI should be:

- Unique
- Consistent
- Predictable
- Meaningful
- Easy to understand

---

## 6. Static Resources

A **Static Resource** has a fixed and predetermined URI.

For example:

```text
file://docs/readme.md
```

The URI does not require any parameters.

Another example:

```text
file://config/application.json
```

A server can expose a fixed list of resources:

```text
Resources

1. file://docs/readme.md
2. file://docs/api.md
3. file://docs/architecture.md
4. file://config/application.json
```

The client can discover these resources and read them when required.

---

## 7. Resource Templates

A **Resource Template** is used when resources are dynamic or parameterized.

Instead of creating a separate resource for every possible value, the server defines a template.

Example:

```text
file://users/{userId}/settings
```

Here:

```text
{userId}
```

is a parameter.

The client can request:

```text
file://users/user_402/settings
```

or:

```text
file://users/user_501/settings
```

The same template can represent many resources.

Conceptually:

```text
Resource Template

file://users/{userId}/settings
              │
              ├── user_101
              ├── user_102
              ├── user_103
              └── user_104
```

Resource templates are useful for:

- Users
- Products
- Customers
- Orders
- Database records
- Documents
- API endpoints
- Dynamic datasets

---

## 8. Static Resource vs Resource Template

### Static Resource

A static resource has a fixed URI.

Example:

```text
file://docs/readme.md
```

It represents one specific resource.

### Resource Template

A resource template contains variables.

Example:

```text
file://users/{userId}/settings
```

It can represent many resources.

Comparison:

| Static Resource | Resource Template |
|---|---|
| Fixed URI | Parameterized URI |
| Represents a specific resource | Represents multiple resources |
| Easy to define | Useful for dynamic data |
| Example: `file://docs/api.md` | Example: `file://users/{userId}` |

---

## 9. Resource Metadata

When an MCP Server exposes a resource, it provides metadata describing that resource.

Important metadata includes:

1. URI
2. Name
3. Description
4. MIME Type

This metadata helps the MCP Client and LLM understand what the resource contains and when it may be useful.

---

## 10. URI

The **URI** uniquely identifies the resource.

Example:

```text
file://docs/mcp-introduction.md
```

The client uses this URI when requesting the resource.

The URI should clearly identify the resource and follow a consistent structure.

---

## 11. Name

The **Name** provides a human-readable title for the resource.

Examples:

```text
MCP Introduction
```

```text
Application Configuration
```

```text
Customer Database Record
```

A clear name makes resource discovery easier.

---

## 12. Description

The **Description** explains what the resource contains and why it may be useful.

Example:

```text
Contains the introduction and basic concepts of the MCP architecture.
```

Another example:

```text
Contains application configuration settings used by the development server.
```

A good description helps the LLM identify relevant resources.

For example, if the user asks:

```text
How does our MCP architecture work?
```

A resource described as:

```text
Contains the MCP system architecture and communication flow.
```

would be highly relevant.

---

## 13. MIME Type

A resource can optionally specify a **MIME Type**.

A MIME type describes the format of the resource content.

Examples:

```text
text/plain
text/markdown
application/json
text/csv
image/png
image/jpeg
application/pdf
```

Common resource formats:

| Resource | MIME Type |
|---|---|
| Plain Text | `text/plain` |
| Markdown | `text/markdown` |
| JSON | `application/json` |
| CSV | `text/csv` |
| PNG | `image/png` |
| JPEG | `image/jpeg` |
| PDF | `application/pdf` |

The MIME type allows the client to understand how the resource content should be interpreted.

---

## 14. Resource Contents

When an MCP Client reads a resource, the server returns its contents.

The contents can be textual or binary.

Example Markdown resource:

```text
URI:
file://docs/readme.md

MIME Type:
text/markdown

Content:

# MCP Resources

Resources provide read-only contextual data
to an MCP Client.
```

Example JSON resource:

```json
{
  "application": "MCP Learning Platform",
  "version": "1.0.0",
  "environment": "development"
}
```

Example CSV resource:

```csv
id,name,department
1,Swapnil,CSE
2,Amit,IT
3,Rahul,ECE
```

An image resource contains binary image data.

---

## 15. Resource Discovery

Resource discovery is the process through which an MCP Client learns what resources are available from an MCP Server.

Conceptually:

```text
MCP Client
     │
     │ Discover Resources
     ▼
MCP Server
     │
     │ Available Resources
     ▼
┌────────────────────────────┐
│ file://docs/readme.md      │
│ file://docs/api.md         │
│ file://data/users.json     │
│ file://images/logo.png     │
└────────────────────────────┘
```

The client can then determine which resource is relevant to the user's request.

---

## 16. Reading a Resource

After discovering a resource, the MCP Client can request its contents.

The general flow is:

```text
1. Client connects to MCP Server
             │
             ▼
2. Client discovers resources
             │
             ▼
3. Client selects a resource
             │
             ▼
4. Client requests the resource
             │
             ▼
5. Server returns resource contents
             │
             ▼
6. Client provides the content as context
             │
             ▼
7. LLM uses the context
```

Example:

```text
User
 │
 │ "Explain our API architecture."
 ▼
MCP Client
 │
 │ Needs API documentation
 ▼
MCP Server
 │
 │ Read
 ▼
file://docs/api.md
 │
 ▼
Resource Content
 │
 ▼
LLM Context
 │
 ▼
LLM Response
```

---

## 17. Resource Lifecycle

A typical Resource interaction can be represented as:

```text
┌───────────────────┐
│    MCP Server     │
│                   │
│ Defines Resources │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│    MCP Client     │
│                   │
│ Discovers         │
│ Resources         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Select Resource   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Read Resource     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Resource Content  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ LLM Context       │
└───────────────────┘
```

---

## 18. Types of MCP Resources

MCP Resources can represent many types of data.

Common examples include:

1. Markdown
2. JSON
3. CSV
4. Images
5. PDF
6. Plain Text
7. Database Records
8. API Data
9. Logs
10. Configuration Files
11. Source Code
12. Reports

---

## 19. Markdown Resources

Markdown resources are useful for documentation and knowledge bases.

Example URI:

```text
file://docs/architecture.md
```

Possible content:

```md
# System Architecture

The application consists of an MCP Host,
MCP Client, and MCP Server.
```

Common use cases:

- Documentation
- README files
- Technical guides
- Knowledge bases
- Architecture documentation
- API documentation

---

## 20. JSON Resources

JSON resources are useful for structured data.

Example URI:

```text
file://config/application.json
```

Example content:

```json
{
  "name": "MCP Server",
  "version": "1.0.0",
  "environment": "development"
}
```

Common use cases:

- Configuration
- API responses
- Application metadata
- Structured datasets
- Settings

---

## 21. CSV Resources

CSV resources are useful for tabular data.

Example URI:

```text
file://data/users.csv
```

Example content:

```csv
id,name,role
1,Swapnil,Developer
2,Amit,Designer
3,Rahul,Tester
```

Common use cases:

- Reports
- User data
- Analytics
- Exported datasets
- Logs
- Business data

---

## 22. Image Resources

Images can also be exposed as resources.

Example URI:

```text
file://images/architecture.png
```

Possible MIME type:

```text
image/png
```

Image resources can be used for:

- Architecture diagrams
- Screenshots
- Product images
- Charts
- Visual documentation
- Design references

---

## 23. PDF Resources

PDF documents can also be represented as resources.

Example:

```text
file://documents/manual.pdf
```

Possible MIME type:

```text
application/pdf
```

PDF resources can contain:

- Manuals
- Reports
- Research papers
- Documentation
- Business documents

---

## 24. Database Resources

Database records or query results can be exposed through resources.

Example:

```text
database://users/402
```

The resource could contain:

```json
{
  "id": 402,
  "name": "User",
  "role": "Developer"
}
```

Database resources are useful for read-oriented access to:

- Customer records
- Product information
- Employee information
- Orders
- User profiles
- Analytics
- Reports

The important distinction is that reading information is different from modifying the database.

---

## 25. API-Based Resources

An MCP Server can retrieve information from an external API and expose the resulting data as a resource.

Example:

```text
api://weather/pune
```

Conceptually:

```text
External API
     │
     ▼
MCP Server
     │
     ▼
MCP Resource
     │
     ▼
MCP Client
     │
     ▼
LLM
```

This allows external data to be incorporated into an MCP-based AI application.

Examples include:

- Weather data
- Stock information
- Public APIs
- Monitoring information
- Business data
- External documentation

---

## 26. Dynamic Resources

Dynamic resources represent information that may depend on parameters or may change over time.

Example:

```text
database://users/{userId}
```

The client may request:

```text
database://users/101
```

or:

```text
database://users/202
```

or:

```text
database://users/303
```

The server resolves the URI and returns the corresponding data.

Another example:

```text
api://weather/{city}
```

Possible requests:

```text
api://weather/pune
api://weather/mumbai
api://weather/delhi
api://weather/bengaluru
```

---

## 27. Resource Templates for Dynamic Data

Resource templates are especially useful when a server needs to expose a large number of related resources.

Example:

```text
database://users/{userId}
```

Request:

```text
database://users/402
```

The server can interpret:

```text
userId = 402
```

and retrieve the corresponding record.

The flow is:

```text
Resource Template
        │
        ▼
database://users/{userId}
        │
        ▼
Client Request
        │
        ▼
database://users/402
        │
        ▼
Server Resolves userId
        │
        ▼
User 402 Data
```

---

## 28. Resources and LLM Context

One of the most important purposes of Resources is providing context to an LLM.

Consider the question:

```text
What does our authentication system do?
```

The LLM may need a documentation resource:

```text
file://docs/authentication.md
```

The workflow becomes:

```text
User Question
      │
      ▼
MCP Client
      │
      │ Identify relevant resource
      ▼
MCP Server
      │
      │ Read
      ▼
authentication.md
      │
      ▼
Resource Content
      │
      ▼
LLM Context
      │
      ▼
LLM Answer
```

Resources therefore act as a bridge between external information and the LLM.

---

## 29. Resource Read vs Tool Execution

A key concept in MCP is understanding the difference between reading a resource and executing a tool.

Suppose a system contains customer information.

Reading customer information:

```text
database://customers/1001
```

can be represented as a Resource.

Changing customer information is an action and can be represented as a Tool.

For example:

```text
READ CUSTOMER
      │
      ▼
RESOURCE


UPDATE CUSTOMER
      │
      ▼
TOOL
```

Similarly:

```text
Read GitHub Issue
      ↓
Resource

Create GitHub Issue
      ↓
Tool

Update GitHub Issue
      ↓
Tool
```

Another example:

```text
Read Calendar Event
      ↓
Resource

Create Calendar Event
      ↓
Tool
```

---

## 30. Read-Only Nature of Resources

Resources are designed primarily for retrieving information without changing the underlying data.

For example:

```text
file://docs/api.md
```

can be read without modifying the documentation.

Similarly:

```text
database://users/402
```

can represent retrieving information about a user.

Resources are therefore useful for:

- Documentation
- Reference material
- Reports
- Configuration
- Read-only datasets
- Knowledge bases
- Application logs

The exact behavior ultimately depends on the MCP Server implementation and the underlying data source.

---

## 31. Resource Metadata and Annotations

Resource metadata helps clients understand how a resource should be interpreted and when it may be useful.

Typical metadata can include:

- URI
- Name
- Description
- MIME Type
- Additional annotations or metadata

Example:

```text
Name:
Production API Documentation

Description:
Documentation for authentication,
endpoints, request formats, and responses.

MIME Type:
text/markdown

URI:
file://docs/production-api.md
```

Good metadata improves resource discovery and selection.

---

## 32. Resource Discovery vs Resource Reading

Resource discovery and resource reading are two separate concepts.

### Resource Discovery

The client asks:

```text
What resources are available?
```

The server returns resource metadata.

Example:

```text
1. MCP Architecture
2. API Documentation
3. Database Schema
4. Configuration
```

### Resource Reading

The client asks:

```text
Give me the contents of the API Documentation.
```

The server returns the resource contents.

The flow is:

```text
DISCOVERY

Client
  │
  │ What resources exist?
  ▼
Server
  │
  ▼
Resource Metadata


READ

Client
  │
  │ Give me resource X
  ▼
Server
  │
  ▼
Resource Contents
```

---

## 33. Resource Updates and Subscriptions

Some resources represent data that can change over time.

Examples:

```text
database://system/status
```

or:

```text
file://logs/application.log
```

When supported by the MCP implementation, clients can receive notifications when resources change and refresh the resource contents.

Conceptually:

```text
Resource
    │
    │ Data Changes
    ▼
MCP Server
    │
    │ Notification
    ▼
MCP Client
    │
    ▼
Refresh Resource
```

This can be useful for:

- Logs
- Monitoring data
- Live status
- Database information
- Dynamic documents
- Continuously changing information

Not every resource needs to support updates or subscriptions.

---

## 34. Resource URI Design

Good URI design is important when creating an MCP Server.

A URI should be:

- Unique
- Consistent
- Meaningful
- Predictable
- Easy to understand

Good examples:

```text
file://docs/readme.md
file://docs/api.md
file://docs/architecture.md
```

For dynamic resources:

```text
users://{userId}
orders://{orderId}
products://{productId}
```

A consistent URI structure makes resources easier to discover and manage.

---

## 35. Resource Organization

A larger MCP Server may expose many resources.

A possible organization is:

```text
Resources
│
├── Documentation
│   ├── introduction.md
│   ├── architecture.md
│   └── api.md
│
├── Configuration
│   ├── application.json
│   └── database.json
│
├── Data
│   ├── users.csv
│   └── products.csv
│
├── Images
│   ├── architecture.png
│   └── workflow.png
│
└── Database
    ├── users/{userId}
    ├── products/{productId}
    └── orders/{orderId}
```

This organization makes the MCP Server easier to maintain.

---

## 36. Example Resource Metadata

A conceptual resource can be represented as:

```text
Resource
│
├── URI
│   └── file://docs/mcp.md
│
├── Name
│   └── MCP Documentation
│
├── Description
│   └── Documentation explaining MCP concepts
│
└── MIME Type
    └── text/markdown
```

Another example:

```text
Resource
│
├── URI
│   └── database://users/402
│
├── Name
│   └── User 402
│
├── Description
│   └── User profile information
│
└── MIME Type
    └── application/json
```

---

## 37. Example: Documentation Resource

Suppose an MCP Server provides application documentation.

Resource URI:

```text
file://docs/architecture.md
```

Metadata:

```text
Name:
Application Architecture

Description:
Contains the architecture and component relationships
of the application.

MIME Type:
text/markdown
```

When the user asks:

```text
Explain the application architecture.
```

The MCP Client can read:

```text
file://docs/architecture.md
```

The content is then provided to the LLM as context.

---

## 38. Example: JSON Configuration Resource

Resource URI:

```text
file://config/application.json
```

Content:

```json
{
  "application": "MCP Demo",
  "version": "1.0.0",
  "environment": "development",
  "database": "sqlite"
}
```

Metadata:

```text
Name:
Application Configuration

Description:
Contains the configuration used by the MCP demo application.

MIME Type:
application/json
```

The LLM can read this resource when answering configuration-related questions.

---

## 39. Example: CSV Resource

Resource URI:

```text
file://data/employees.csv
```

Content:

```csv
id,name,department,salary
101,Swapnil,CSE,60000
102,Amit,IT,55000
103,Rahul,ECE,58000
```

The client can read the resource and provide its contents to the LLM.

The user could ask:

```text
How many employees are in the CSE department?
```

The LLM can use the CSV resource to answer the question.

---

## 40. Example: Dynamic User Resource

A server may define:

```text
database://users/{userId}
```

If the client requests:

```text
database://users/402
```

the server resolves:

```text
userId = 402
```

and retrieves the corresponding data.

Conceptually:

```text
Template:

database://users/{userId}

        │
        ▼

Request:

database://users/402

        │
        ▼

Server:

Find user where ID = 402

        │
        ▼

Resource Content:

{
  "id": 402,
  "name": "User",
  "role": "Developer"
}
```

---

## 41. When Should You Use a Resource?

Use an MCP Resource when the primary requirement is to **provide information**.

Good examples include:

- Read documentation
- Read configuration
- Read a database record
- Read a report
- Read a CSV file
- Read a JSON file
- Read an image
- Read application logs
- Read API data
- Read knowledge-base content

A simple decision rule is:

```text
Does the operation primarily provide information?
                    │
              ┌─────┴─────┐
             YES           NO
              │             │
              ▼             ▼
          RESOURCE         TOOL
```

---

## 42. When Should You Use a Tool?

Use a Tool when the operation performs an action.

Examples:

- Send an email
- Create a GitHub issue
- Delete a file
- Update a database
- Create a calendar event
- Send a Slack message
- Run a calculation
- Trigger a workflow

Example:

```text
Read GitHub Issue
      ↓
Resource

Create GitHub Issue
      ↓
Tool

Update GitHub Issue
      ↓
Tool
```

The distinction is based on the purpose of the operation.

---

## 43. Resources in an MCP Learning Repository

For a practical MCP learning repository, Resources can be organized into separate examples.

A possible structure is:

```text
Module 08 - Resources/
│
├── README.md
├── Theory.md
│
├── 01-Markdown/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── resources/
│       └── documentation.md
│
├── 02-JSON/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── resources/
│       └── config.json
│
├── 03-CSV/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── resources/
│       └── users.csv
│
├── 04-Image/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── resources/
│       └── architecture.png
│
├── 05-Database/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── database/
│       └── app.db
│
└── 06-Dynamic-Template/
    ├── README.md
    ├── TypeScript/
    │   ├── package.json
    │   └── server.ts
    └── resources/
        └── users/
```

---

## 44. Resource Examples for This Module

The practical examples can be organized as:

```text
01. Markdown
02. JSON
03. CSV
04. Image
05. Database
06. Dynamic Resource Template
```

The learning progression is:

```text
Static File
    │
    ▼
Markdown
    │
    ▼
JSON
    │
    ▼
CSV
    │
    ▼
Image
    │
    ▼
Database
    │
    ▼
Dynamic Resource Template
```

---

## 45. Key Characteristics of MCP Resources

### 1. Read-Oriented

Resources are designed primarily for retrieving information.

### 2. URI-Based

Every resource is identified using a URI.

### 3. Discoverable

Clients can discover resources exposed by the server.

### 4. Context-Oriented

Resource contents can be provided to an LLM as contextual information.

### 5. Typed

Resources can provide MIME type information describing their content.

### 6. Static or Dynamic

Resources can be fixed resources or represented through parameterized templates.

### 7. Structured or Unstructured

Resources can contain JSON, CSV, Markdown, plain text, database records, images, PDFs, and other formats.

### 8. Server-Provided

Resources are exposed by MCP Servers and consumed by MCP Clients.

### 9. URI Addressable

Each resource can be identified through a URI.

### 10. Suitable for External Context

Resources allow AI applications to access information outside the model's built-in knowledge.

---

## 46. Important Terminology

### Resource

A piece of data exposed by an MCP Server.

### URI

A unique identifier used to identify a resource.

### Resource Template

A parameterized URI pattern used to represent dynamic resources.

### MIME Type

A type identifier describing the format of resource content.

### Resource Metadata

Information describing a resource, such as its name, description, URI, and MIME type.

### Resource Contents

The actual data returned when a resource is read.

### Resource Discovery

The process through which an MCP Client learns what resources are available.

### Resource Read

The process through which an MCP Client requests the contents of a resource.

### Resource Subscription

A mechanism for receiving notifications when supported resources change.

---

## 47. Complete MCP Resource Flow

The complete flow can be represented as:

```text
                         USER
                           │
                           │ Question
                           ▼
                  ┌──────────────────┐
                  │    MCP HOST      │
                  │                  │
                  │   Application    │
                  │        +         │
                  │       LLM        │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  │                  │
                  │ Discover         │
                  │ Resources        │
                  └────────┬─────────┘
                           │
                           │ List / Read
                           ▼
                  ┌──────────────────┐
                  │    MCP SERVER    │
                  │                  │
                  │    Resources     │
                  └────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Markdown           JSON             Database
      Resource          Resource           Resource
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    Resource Content
                           │
                           ▼
                    MCP Client Context
                           │
                           ▼
                          LLM
                           │
                           ▼
                       Response
```

---

## 48. Summary

MCP Resources provide a standardized way for MCP Servers to expose information to MCP Clients and LLM applications.

A Resource can represent many types of information, including:

```text
Markdown
JSON
CSV
Images
PDFs
Logs
Configuration
Database Records
API Data
Dynamic Data
Source Code
Reports
```

Each resource is identified by a URI and can include metadata such as:

```text
URI
Name
Description
MIME Type
```

Resources can be either:

```text
Static Resource
```

or:

```text
Resource Template
```

Static resources use fixed URIs:

```text
file://docs/readme.md
```

Resource templates use parameterized URIs:

```text
file://users/{userId}/settings
```

The general MCP Resource flow is:

```text
MCP Server
    │
    │ Exposes
    ▼
Resources
    │
    │ Discover
    ▼
MCP Client
    │
    │ Read
    ▼
Resource Contents
    │
    ▼
LLM Context
    │
    ▼
AI Response
```

The fundamental distinction is:

```text
┌─────────────────────────────────────────┐
│                  MCP                    │
├──────────────────┬──────────────────────┤
│ Resources        │ Tools                │
├──────────────────┼──────────────────────┤
│ Provide data     │ Perform actions      │
│ Read-oriented    │ Execute-oriented     │
│ Provide context  │ Perform operations   │
│ Markdown         │ Send Email           │
│ JSON             │ Create Issue         │
│ CSV              │ Update Database      │
│ Database Record  │ Create Event         │
└──────────────────┴──────────────────────┘
```

Therefore:

> **MCP Resources are the read-oriented data layer of MCP, allowing servers to expose structured and unstructured information that clients can discover, retrieve, and provide to LLMs as context.**
