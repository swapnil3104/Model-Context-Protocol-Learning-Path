# MCP Logging - Architecture

> A complete architecture guide for Logging in the Model Context Protocol (MCP), covering historical protocol-level Logging, modern application logging, stdio behavior, structured logs, observability, OpenTelemetry, components, responsibilities, data flow, security, and production architecture.

---

# Table of Contents

1. Introduction
2. Logging Architecture Overview
3. Important MCP Version Note
4. Historical MCP Logging Architecture
5. Modern MCP Logging Architecture
6. High-Level Architecture
7. Component Architecture
8. MCP Host
9. MCP Client
10. MCP Server
11. Application Logger
12. Log Handler
13. Log Collector
14. Observability Backend
15. Dashboard and Alerting
16. Historical Logging Capability
17. Historical Logging Level Configuration
18. Historical Logging Notification
19. Severity Filtering
20. Stdio Architecture
21. Why stdout Must Stay Clean
22. stderr Logging Architecture
23. Streamable HTTP Architecture
24. Structured Logging Architecture
25. Request Correlation Architecture
26. Trace Context Architecture
27. Logs, Metrics, and Traces
28. OpenTelemetry Architecture
29. Tool Logging Architecture
30. Resource Logging Architecture
31. Prompt Logging Architecture
32. Error Logging Architecture
33. Security Logging Architecture
34. Audit Logging Architecture
35. Sensitive Data Protection
36. Centralized Logging Architecture
37. Log Storage Architecture
38. Log Retention Architecture
39. Production Architecture
40. Development Architecture
41. Local Debugging Architecture
42. Distributed MCP Architecture
43. Multi-Server Architecture
44. Agentic Workflow Logging
45. Complete Historical MCP Flow
46. Complete Modern Logging Flow
47. Architecture Comparison
48. Recommended Architecture
49. Best Practices
50. Common Architecture Mistakes
51. Key Takeaways
52. Final Architecture Summary

---

# 1. Introduction

Logging architecture defines how operational information moves through an MCP system.

An MCP application can contain several layers:

```text
User
  |
  v
MCP Host
  |
  v
MCP Client
  |
  v
MCP Server
  |
  +---- Tools
  |
  +---- Resources
  |
  +---- Prompts
  |
  +---- External APIs
  |
  +---- Databases
```

Logging adds an observability path alongside the application path:

```text
Application Path
----------------

User
  |
  v
MCP Host
  |
  v
MCP Client
  |
  v
MCP Server
  |
  v
Tools / Resources / Prompts


Logging Path
------------

MCP Server
  |
  v
Logger
  |
  v
Log Handler
  |
  v
Collector
  |
  v
Observability Backend
  |
  +---- Dashboard
  |
  +---- Search
  |
  +---- Alerts
```

The two paths should be treated separately.

---

# 2. Logging Architecture Overview

A simple architecture is:

```text
                   MCP APPLICATION
                         |
                         v
                    MCP SERVER
                         |
                         v
                    APPLICATION
                      LOGGER
                         |
                         v
                    LOG HANDLER
                         |
                         v
                  LOG COLLECTION
                         |
                         v
                OBSERVABILITY SYSTEM
                   /           \
                  /             \
                 v               v
            DASHBOARDS         ALERTS
```

The logging system should not interfere with MCP protocol communication.

The core principle is:

```text
MCP Protocol Data
        ≠
Operational Logging Data
```

---

# 3. Important MCP Version Note

The MCP specification revision dated **2026-07-28** formally deprecated the protocol-level Logging feature.

This means the architecture should distinguish between:

```text
Historical / Compatibility Architecture
```

and:

```text
Modern Recommended Architecture
```

Historical architecture may contain:

```text
logging capability
logging/setLevel
notifications/message
```

Modern architecture should generally use:

```text
Standard Application Logging
        +
Structured Logging
        +
stderr for stdio
        +
OpenTelemetry / Observability
```

Existing SDKs may continue to expose the older protocol-level functionality for compatibility.

---

# 4. Historical MCP Logging Architecture

The historical MCP Logging architecture can be represented as:

```text
                    MCP HOST
                       |
                       v
                  MCP CLIENT
                       |
                       | Initialize
                       v
                  MCP SERVER
                       |
                       | Advertises
                       v
               Logging Capability
                       |
                       |
              +--------+--------+
              |                 |
              v                 v
       logging/setLevel     Application
              |              generates
              v              log event
        Logging Level             |
              |                  v
              |               Logger
              |                  |
              +------------------+
                       |
                       v
             Severity Filtering
                       |
                       v
             notifications/message
                       |
                       v
                  MCP CLIENT
                       |
                       v
                  MCP HOST
                       |
                       v
                Operator / UI
```

This architecture is useful for understanding older and compatibility-oriented MCP implementations.

---

# 5. Modern MCP Logging Architecture

A modern architecture separates application logs from the MCP protocol.

```text
                    MCP HOST
                       |
                       v
                  MCP CLIENT
                       |
                       v
                  MCP SERVER
                       |
          +------------+------------+
          |            |            |
          v            v            v
        Logs        Metrics       Traces
          |            |            |
          +------------+------------+
                       |
                       v
                Observability
                   Collector
                       |
                       v
              Observability Backend
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Search      Dashboard      Alerts
```

For stdio:

```text
              MCP SERVER
                   |
          +--------+--------+
          |                 |
          v                 v
       stdout             stderr
          |                 |
          v                 v
    MCP Protocol      Application Logs
```

The important rule is:

```text
stdout = MCP protocol communication
stderr = operational logging
```

---

# 6. High-Level Architecture

The complete system can be viewed as multiple layers.

```text
+----------------------------------------------------------+
|                      MCP HOST                            |
|                                                          |
|  User Interface / Agent / Application                    |
+---------------------------+------------------------------+
                            |
                            v
+----------------------------------------------------------+
|                     MCP CLIENT                           |
|                                                          |
|  Session / Transport / Request Handling / Correlation    |
+---------------------------+------------------------------+
                            |
                            v
+----------------------------------------------------------+
|                     MCP SERVER                           |
|                                                          |
|  Tools / Resources / Prompts / Business Logic            |
+---------------------------+------------------------------+
                            |
             +--------------+--------------+
             |                             |
             v                             v
+---------------------------+   +--------------------------+
|     APPLICATION LOGGING   |   |       TELEMETRY          |
|                           |   |                          |
| Logger                    |   | Metrics                  |
| Log Level                 |   | Traces                   |
| Structured Events         |   | Trace Context            |
+-------------+-------------+   +------------+-------------+
              |                              |
              +---------------+--------------+
                              |
                              v
                  +-----------------------+
                  | Observability Layer   |
                  +-----------+-----------+
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
          Storage          Dashboard         Alerts
```

---

# 7. Component Architecture

A production logging architecture can contain:

```text
1. MCP Host
2. MCP Client
3. MCP Server
4. Application Logger
5. Log Handler
6. Log Collector
7. Telemetry Collector
8. Storage Backend
9. Search System
10. Dashboard
11. Alerting System
```

Each component has a different responsibility.

---

# 8. MCP Host

The MCP Host is the application that uses MCP.

Examples of responsibilities:

```text
User interaction
Model interaction
Session management
MCP client management
Tool orchestration
UI rendering
```

The host can have its own logs:

```text
INFO user_request_started
INFO mcp_session_created
INFO tool_result_received
ERROR mcp_connection_failed
```

---

# 9. MCP Client

The MCP Client communicates with the MCP Server.

The client can observe:

```text
Connection
Initialization
Requests
Responses
Notifications
Errors
Timeouts
Transport events
```

Example:

```text
INFO mcp_connection_started
INFO mcp_initialize_completed
INFO tool_call_started
INFO tool_call_completed
ERROR tool_call_timeout
```

The client should add correlation information where possible.

---

# 10. MCP Server

The MCP Server is usually the main source of application logs.

Responsibilities include:

```text
Tool execution
Resource access
Prompt handling
External API communication
Database operations
Validation
Business logic
Error handling
```

Example:

```text
MCP Server
    |
    +---- Tool
    |      |
    |      +---- Logger
    |
    +---- Resource
    |      |
    |      +---- Logger
    |
    +---- Prompt
           |
           +---- Logger
```

---

# 11. Application Logger

The application logger creates log records.

Example:

```python
logger.info("Tool execution started")
```

A structured logger may generate:

```json
{
  "level": "INFO",
  "event": "tool_started",
  "tool": "search_books"
}
```

The logger should be centralized so that different components use consistent formats and levels.

---

# 12. Log Handler

A handler determines where logs go.

Possible destinations:

```text
stderr
stdout
File
System Journal
Container Runtime
Log Collector
Remote Logging Service
```

For stdio MCP servers:

```text
Logger
  |
  v
stderr
```

For production:

```text
Logger
  |
  v
Structured Handler
  |
  v
Collector
```

---

# 13. Log Collector

A collector gathers logs from applications.

Architecture:

```text
MCP Server A ----\
MCP Server B -----\
MCP Server C ------> Log Collector ---> Backend
MCP Server D -----/
```

The collector can:

```text
Parse
Enrich
Filter
Batch
Forward
Buffer
```

Structured logs make this process easier.

---

# 14. Observability Backend

The backend stores and analyzes telemetry.

Conceptual components:

```text
Logs
Metrics
Traces
   |
   v
Observability Backend
   |
   +---- Search
   +---- Aggregation
   +---- Visualization
   +---- Alerts
```

The backend could be cloud-hosted or self-hosted.

---

# 15. Dashboard and Alerting

Dashboards provide visual information:

```text
Request Rate
Error Rate
Tool Latency
Timeout Count
Server Availability
```

Alerts notify operators about important conditions.

Example:

```text
ERROR rate > threshold
```

then:

```text
Alert
```

---

# 16. Historical Logging Capability

The historical MCP protocol-level Logging architecture included a server capability indicating Logging support.

Conceptually:

```json
{
  "capabilities": {
    "logging": {}
  }
}
```

Architecture:

```text
Client
  |
  | initialize
  v
Server
  |
  | capabilities
  v
logging support
```

This capability belongs to the older protocol-level Logging design.

For new systems, do not treat this capability as the foundation of application logging.

---

# 17. Historical Logging Level Configuration

Historically, the client could configure a minimum logging level.

Conceptually:

```text
MCP Client
    |
    | logging/setLevel
    | level = INFO
    v
MCP Server
```

The server then filters messages:

```text
DEBUG      → Drop
INFO       → Send
NOTICE     → Send
WARNING    → Send
ERROR      → Send
CRITICAL   → Send
ALERT      → Send
EMERGENCY  → Send
```

This architecture reduces unnecessary notification traffic.

---

# 18. Historical Logging Notification

Historical log delivery used:

```text
notifications/message
```

Conceptual architecture:

```text
MCP Server
    |
    | notifications/message
    v
MCP Client
    |
    v
Host
```

The message could contain information such as:

```text
Level
Logger
Data
```

This was protocol-level logging rather than ordinary application logging.

---

# 19. Severity Filtering

Severity filtering determines which events are emitted or forwarded.

Architecture:

```text
Application Event
      |
      v
Logger
      |
      v
Severity
      |
      v
Filter
      |
      +---- Below Threshold → Drop
      |
      +---- Above Threshold → Continue
                              |
                              v
                           Handler
```

Example:

```text
Configured Level = WARNING
```

Result:

```text
DEBUG       ✗
INFO        ✗
NOTICE      ✗
WARNING     ✓
ERROR       ✓
CRITICAL    ✓
ALERT       ✓
EMERGENCY   ✓
```

---

# 20. Stdio Architecture

Stdio transport has a unique architecture.

```text
             MCP SERVER
                 |
       +---------+---------+
       |                   |
       v                   v
     stdin               stdout
       |                   |
       |                   |
       +---- Protocol -----+
                 |
                 |
              stderr
                 |
                 v
           Operational Logs
```

A cleaner conceptual representation is:

```text
Input:
Host/Client
     |
     v
stdin
     |
     v
MCP Server

Output:
MCP Server
     |
     v
stdout
     |
     v
Host/Client

Logging:
MCP Server
     |
     v
stderr
     |
     v
Log Collector
```

---

# 21. Why stdout Must Stay Clean

In stdio MCP communication, stdout carries protocol messages.

Therefore this is dangerous:

```python
print("Server started")
```

because the output may be interpreted as protocol data.

Correct approach:

```python
logger.info("Server started")
```

with logging configured to stderr.

Architecture:

```text
                  MCP SERVER
                      |
             +--------+--------+
             |                 |
             v                 v
          stdout            stderr
             |                 |
             v                 v
      MCP JSON-RPC         Log Output
             |                 |
             v                 v
           Client          Collector
```

---

# 22. stderr Logging Architecture

A typical stdio production flow:

```text
MCP Server
    |
    v
Python / Node Logger
    |
    v
stderr
    |
    v
Process Supervisor
    |
    v
Container / Host Logging
    |
    v
Log Collector
    |
    v
Observability Backend
```

This keeps protocol communication separate from operational information.

---

# 23. Streamable HTTP Architecture

HTTP-based MCP deployments have a different transport path.

```text
MCP Client
    |
    | HTTP
    v
HTTP Server
    |
    v
MCP Server
    |
    +---- Application Logger
    |
    +---- Metrics
    |
    +---- Traces
```

Logging does not need to be sent through stdout as protocol output.

A typical production architecture is:

```text
MCP Server
   |
   +---- Structured Logs
   |
   +---- Metrics
   |
   +---- Traces
           |
           v
      Collector
           |
           v
      Backend
```

---

# 24. Structured Logging Architecture

Structured logging transforms events into machine-readable records.

Architecture:

```text
Application
    |
    v
Logger
    |
    v
Structured Event
    |
    v
JSON Log
    |
    v
Collector
    |
    v
Search / Storage
```

Example:

```json
{
  "timestamp": "2026-08-10T10:20:30Z",
  "level": "INFO",
  "service": "mcp-server",
  "event": "tool_completed",
  "tool": "search_books",
  "duration_ms": 120,
  "request_id": "abc123"
}
```

---

# 25. Request Correlation Architecture

Request correlation connects related events.

```text
                 request_id=abc123
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
     Request Log    Tool Log      Error Log
```

Example:

```text
INFO request_started request_id=abc123
INFO tool_started request_id=abc123
INFO api_call request_id=abc123
ERROR api_timeout request_id=abc123
ERROR tool_failed request_id=abc123
```

This allows an operator to search:

```text
request_id=abc123
```

and see the entire sequence.

---

# 26. Trace Context Architecture

Distributed systems require trace context.

Architecture:

```text
MCP Host
    |
    | Trace Context
    v
MCP Client
    |
    | Trace Context
    v
MCP Server
    |
    | Trace Context
    v
Tool
    |
    | Trace Context
    v
External API
```

A trace may contain:

```text
Trace ID
Span ID
Parent Span
Trace State
Baggage
```

The current MCP specification direction includes W3C Trace Context propagation for distributed tracing.

---

# 27. Logs, Metrics, and Traces

A complete observability architecture contains:

```text
                 Application
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
     Logs         Metrics        Traces
       |             |             |
       +-------------+-------------+
                     |
                     v
              Observability
                  Platform
```

Each answers a different question.

```text
Logs    → What happened?
Metrics → How much / how often?
Traces  → Where did it happen?
```

---

# 28. OpenTelemetry Architecture

A modern telemetry architecture may use OpenTelemetry.

```text
                  MCP SERVER
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        Logs       Metrics      Traces
          |           |           |
          +-----------+-----------+
                      |
                      v
             OpenTelemetry SDK
                      |
                      v
             OpenTelemetry
                 Collector
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
        Logs       Metrics      Traces
          |           |           |
          +-----------+-----------+
                      |
                      v
             Observability Backend
```

This provides a standardized telemetry pipeline.

---

# 29. Tool Logging Architecture

Tool execution can be represented as:

```text
MCP Client
    |
    | tools/call
    v
MCP Server
    |
    v
Tool
    |
    +---- Log: started
    |
    +---- External API
    |
    +---- Log: dependency completed
    |
    +---- Log: completed
    |
    v
Tool Result
    |
    v
MCP Client
```

Example events:

```text
tool_started
dependency_started
dependency_completed
tool_completed
tool_failed
```

---

# 30. Resource Logging Architecture

Resource access:

```text
MCP Client
    |
    | Resource Request
    v
MCP Server
    |
    v
Resource Handler
    |
    +---- Log request
    |
    +---- Load resource
    |
    +---- Log result
    |
    v
Resource Result
```

Avoid logging the entire resource content unless specifically required.

---

# 31. Prompt Logging Architecture

Prompt architecture:

```text
MCP Client
    |
    | Prompt Request
    v
MCP Server
    |
    v
Prompt Handler
    |
    +---- Log prompt metadata
    |
    v
Prompt Result
```

Preferred logging:

```text
prompt_name
prompt_version
request_id
duration_ms
```

Avoid unnecessary full prompt-content logging.

---

# 32. Error Logging Architecture

Error handling should create structured error events.

```text
Operation
    |
    v
Exception
    |
    v
Error Handler
    |
    v
Structured Error Log
    |
    +---- request_id
    +---- trace_id
    +---- error_type
    +---- duration
    |
    v
Observability Backend
```

Example:

```json
{
  "level": "ERROR",
  "event": "tool_failed",
  "tool": "search_books",
  "request_id": "abc123",
  "error_type": "TimeoutError",
  "duration_ms": 5000
}
```

---

# 33. Security Logging Architecture

Security events should follow a controlled path.

```text
Security Event
      |
      v
Security Logger
      |
      v
Redaction / Filtering
      |
      v
Secure Log Collector
      |
      v
Protected Storage
      |
      v
Security Dashboard / SIEM
```

Examples:

```text
Authentication failure
Authorization failure
Suspicious tool call
Rate limit violation
Configuration change
Credential failure
```

---

# 34. Audit Logging Architecture

Audit logs should be treated separately from ordinary debug logs.

```text
Important Action
      |
      v
Audit Logger
      |
      v
Immutable / Protected Storage
      |
      v
Audit Search
```

Example:

```text
configuration_changed
permission_changed
sensitive_operation_executed
```

Audit logs often require stronger retention and access controls.

---

# 35. Sensitive Data Protection

Logging architecture should include a security boundary.

```text
Application
    |
    v
Logger
    |
    v
Redaction
    |
    v
Structured Log
    |
    v
Collector
```

Potential sensitive information:

```text
Passwords
API Keys
Access Tokens
Private Keys
Personal Data
Private Documents
Full Prompts
Confidential Tool Arguments
```

The redaction layer should prevent accidental leakage.

---

# 36. Centralized Logging Architecture

For multiple MCP servers:

```text
+-------------+
| MCP Server A|
+------+------+
       |
       |
+------v------+
| MCP Server B|
+------+------+
       |
       |
+------v------+
| MCP Server C|
+------+------+
       |
       +----------------+
                        |
                        v
                +---------------+
                | Log Collector |
                +-------+-------+
                        |
                        v
                +---------------+
                | Log Storage   |
                +-------+-------+
                        |
             +----------+----------+
             |                     |
             v                     v
        Dashboard               Alerts
```

Centralization makes cross-service troubleshooting easier.

---

# 37. Log Storage Architecture

Logs can be stored in:

```text
Local Files
Container Logging
Cloud Logging
Search Index
Object Storage
Security Archive
```

Conceptual architecture:

```text
Collector
   |
   +---- Hot Storage
   |       |
   |       +---- Fast Search
   |
   +---- Cold Storage
           |
           +---- Long-Term Retention
```

---

# 38. Log Retention Architecture

Retention can be tiered:

```text
Recent Logs
     |
     v
Hot Storage
     |
     v
Older Logs
     |
     v
Cold Storage
     |
     v
Expiration
```

Example concept:

```text
DEBUG → short retention
INFO  → medium retention
AUDIT → longer retention
```

Actual retention should be based on organizational requirements.

---

# 39. Production Architecture

A production-ready architecture can look like:

```text
                         USERS
                           |
                           v
                     MCP HOST
                           |
                           v
                      MCP CLIENT
                           |
                           v
                     MCP SERVER
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
           TOOLS       RESOURCES      PROMPTS
             |             |             |
             +-------------+-------------+
                           |
                           v
                    APPLICATION LOGGER
                           |
              +------------+------------+
              |            |            |
              v            v            v
            LOGS        METRICS       TRACES
              |            |            |
              +------------+------------+
                           |
                           v
                  OTEL / COLLECTOR
                           |
                           v
                 OBSERVABILITY BACKEND
                  /         |         \
                 /          |          \
                v           v           v
            SEARCH      DASHBOARD     ALERTS
```

---

# 40. Development Architecture

Development can use a simpler architecture:

```text
Developer
    |
    v
MCP Server
    |
    v
Logger
    |
    v
Terminal / stderr
```

Example:

```text
INFO Starting MCP server
INFO Tool registered: search_books
INFO Client connected
INFO Tool called
ERROR Tool failed
```

This is sufficient for local debugging.

---

# 41. Local Debugging Architecture

For a local stdio server:

```text
Developer
   |
   v
MCP Client
   |
   | stdin/stdout
   v
MCP Server
   |
   +---- stdout → MCP protocol
   |
   +---- stderr → terminal logs
```

This separation is extremely important.

---

# 42. Distributed MCP Architecture

A distributed MCP environment may look like:

```text
                  MCP HOST
                     |
                     v
                MCP CLIENT
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Server A   Server B   Server C
          |          |          |
          +----------+----------+
                     |
                     v
              Telemetry Layer
                     |
          +----------+----------+
          |          |          |
          v          v          v
        Logs      Metrics     Traces
          |          |          |
          +----------+----------+
                     |
                     v
              Observability
                  Backend
```

Correlation becomes critical because a single user request may cross several MCP servers.

---

# 43. Multi-Server Architecture

Example:

```text
User
 |
 v
Host
 |
 v
Client
 |
 +---- MCP Server: Search
 |
 +---- MCP Server: Database
 |
 +---- MCP Server: Email
 |
 +---- MCP Server: Analytics
```

A common trace can be:

```text
trace_id=xyz

Host
 ↓
Search Server
 ↓
Database Server
 ↓
Analytics Server
```

Logs from all servers can be connected through the same trace context.

---

# 44. Agentic Workflow Logging

Agentic workflows can generate many events.

Architecture:

```text
User
 |
 v
Agent
 |
 +---- Think / Plan
 |
 +---- Tool Call
 |       |
 |       v
 |    MCP Server
 |
 +---- Tool Result
 |
 +---- Next Step
 |
 +---- Tool Call
 |
 +---- Final Response
```

Logging architecture:

```text
Agent Event
    |
    v
Correlation Context
    |
    v
Structured Logger
    |
    v
Observability Backend
```

Useful fields:

```text
trace_id
request_id
step_id
tool
duration
status
error
```

Avoid storing private model context unnecessarily.

---

# 45. Complete Historical MCP Flow

The historical protocol-level Logging flow can be represented as:

```text
                         USER
                           |
                           v
                      MCP HOST
                           |
                           v
                      MCP CLIENT
                           |
                           | Initialize
                           v
                      MCP SERVER
                           |
                           | Advertises
                           v
                 Logging Capability
                           |
                           |
                 Client configures level
                           |
                           | logging/setLevel
                           v
                      MCP SERVER
                           |
                           v
                    Application Event
                           |
                           v
                         Logger
                           |
                           v
                   Severity Filter
                           |
                    +------+------+
                    |             |
                  Reject        Accept
                    |             |
                    v             v
                  Drop      notifications/message
                                  |
                                  v
                             MCP CLIENT
                                  |
                                  v
                              MCP HOST
                                  |
                                  v
                               User
```

---

# 46. Complete Modern Logging Flow

Recommended modern flow:

```text
                         USER
                           |
                           v
                      MCP HOST
                           |
                           v
                      MCP CLIENT
                           |
                           v
                      MCP SERVER
                           |
              +------------+------------+
              |            |            |
              v            v            v
            TOOL        RESOURCE      PROMPT
              |            |            |
              +------------+------------+
                           |
                           v
                    Application Logger
                           |
                           v
                   Structured Log Event
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          stderr        Metrics        Traces
             |             |             |
             +-------------+-------------+
                           |
                           v
                  Telemetry Collector
                           |
                           v
               Observability Platform
                    /       |       \
                   /        |        \
                  v         v         v
               Search   Dashboard   Alerts
```

---

# 47. Architecture Comparison

| Feature | Historical MCP Logging | Modern Recommended Logging |
|---|---|---|
| Main purpose | Protocol-level log delivery | Application observability |
| Server capability | Logging capability | Normal application logger |
| Configuration | `logging/setLevel` | Logger configuration |
| Delivery | `notifications/message` | stderr / collector / telemetry |
| stdio logs | Protocol notification approach | stderr |
| Structured logs | Optional | Recommended |
| Correlation | Limited / implementation-dependent | Request IDs + trace IDs |
| Metrics | Separate | Integrated observability |
| Traces | Separate | Integrated observability |
| OpenTelemetry | Not central | Recommended direction |
| New implementation | Deprecated | Preferred |
| Compatibility | Useful for existing systems | Primary modern approach |

---

# 48. Recommended Architecture

For a new MCP project, use this architecture:

```text
                     MCP HOST
                        |
                        v
                   MCP CLIENT
                        |
                        v
                   MCP SERVER
                        |
             +----------+----------+
             |          |          |
             v          v          v
           Tools    Resources   Prompts
             |          |          |
             +----------+----------+
                        |
                        v
                 Application Layer
                        |
             +----------+----------+
             |          |          |
             v          v          v
           Logs      Metrics     Traces
             |          |          |
             +----------+----------+
                        |
                        v
               OpenTelemetry
                        |
                        v
                  Collector
                        |
                        v
             Observability Backend
                 /      |      \
                /       |       \
               v        v        v
            Search   Dashboard  Alerts
```

For stdio:

```text
                  MCP SERVER
                       |
             +---------+---------+
             |                   |
             v                   v
          stdout              stderr
             |                   |
             v                   v
       MCP Protocol       Operational Logs
```

---

# 49. Best Practices

## Separate protocol and logging channels

```text
stdout → MCP protocol
stderr → logs
```

for stdio deployments.

---

## Use structured logs

Prefer:

```json
{
  "event": "tool_completed",
  "tool": "search_books",
  "duration_ms": 120
}
```

over free-form messages.

---

## Add correlation

Use:

```text
request_id
trace_id
```

where appropriate.

---

## Protect sensitive information

Implement:

```text
Redaction
Filtering
Access Control
Retention Policies
```

---

## Use observability

Production systems should consider:

```text
Logs
Metrics
Traces
```

together.

---

## Keep logs actionable

A good log should help answer:

```text
What happened?
Where?
When?
Why?
Which request?
What should be done?
```

---

## Do not over-log

Avoid:

```text
Every function call
Every variable
Full user input
Full model context
Secrets
Large payloads
```

unless there is a controlled reason.

---

# 50. Common Architecture Mistakes

## Mistake 1: Writing logs to stdout

```text
MCP Protocol
     +
Random print statements
     |
     v
stdout
```

This can corrupt stdio protocol communication.

---

## Mistake 2: Logging secrets

```text
API_KEY
PASSWORD
TOKEN
PRIVATE_KEY
```

Never intentionally include these.

---

## Mistake 3: No correlation IDs

Without:

```text
request_id
trace_id
```

distributed debugging becomes difficult.

---

## Mistake 4: Treating logs as user output

Logs are operational data.

Tool results are application data.

Keep them separate.

---

## Mistake 5: Building new systems around deprecated protocol-level Logging

The protocol-level Logging feature is deprecated in the 2026-07-28 specification.

Modern applications should use standard logging and observability.

---

## Mistake 6: No retention policy

Unlimited logs create:

```text
Storage Cost
Performance Problems
Privacy Risk
Operational Complexity
```

---

# 51. Key Takeaways

- Logging architecture is an observability path alongside the MCP application path.
- MCP Host and MCP Client can have their own operational logs.
- MCP Servers are usually the primary source of application logs.
- Historical MCP protocol-level Logging used `logging/setLevel` and `notifications/message`.
- The historical Logging capability should mainly be understood for compatibility and existing implementations.
- Protocol-level Logging was deprecated in the MCP 2026-07-28 specification.
- Standard application logging is the preferred modern foundation.
- Stdio MCP servers should keep stdout reserved for protocol traffic.
- stderr is appropriate for operational logging in stdio deployments.
- Structured logs are easier to search, aggregate, and correlate.
- Request IDs connect related events.
- Trace IDs connect events across distributed services.
- Logs, metrics, and traces complement one another.
- OpenTelemetry provides a modern telemetry architecture.
- Security and privacy must be part of logging architecture.
- Centralized logging is valuable for multi-server MCP systems.
- Production architecture should separate protocol communication, application behavior, and observability.

---

# 52. Final Architecture Summary

## Historical MCP Logging

```text
                 MCP CLIENT
                     |
                     | logging/setLevel
                     v
                 MCP SERVER
                     |
                  Logger
                     |
               Log Filtering
                     |
                     v
            notifications/message
                     |
                     v
                 MCP CLIENT
```

---

## Modern MCP Logging

```text
                 MCP CLIENT
                     |
                     v
                 MCP SERVER
                     |
          +----------+----------+
          |          |          |
          v          v          v
        LOGS       METRICS     TRACES
          |          |          |
          +----------+----------+
                     |
                     v
               OpenTelemetry
                     |
                     v
              Telemetry Collector
                     |
                     v
            Observability Backend
                     |
          +----------+----------+
          |          |          |
          v          v          v
       SEARCH    DASHBOARD    ALERTS
```

---

## Stdio Architecture

```text
                  MCP SERVER
                       |
             +---------+---------+
             |                   |
             v                   v
          stdout              stderr
             |                   |
             v                   v
       MCP Protocol       Operational Logs
             |                   |
             v                   v
          CLIENT             COLLECTOR
```

---

## Complete Production Architecture

```text
                              USER
                                |
                                v
                           MCP HOST
                                |
                                v
                           MCP CLIENT
                                |
                                v
                           MCP SERVER
                                |
                +---------------+---------------+
                |               |               |
                v               v               v
              TOOLS         RESOURCES        PROMPTS
                |               |               |
                +---------------+---------------+
                                |
                                v
                         APPLICATION LOGIC
                                |
               +----------------+----------------+
               |                |                |
               v                v                v
             LOGS            METRICS           TRACES
               |                |                |
               +----------------+----------------+
                                |
                                v
                       OPENTELEMETRY
                                |
                                v
                         OTEL COLLECTOR
                                |
                                v
                    OBSERVABILITY BACKEND
                       /        |        \
                      /         |         \
                     v          v          v
                 LOG SEARCH  DASHBOARDS  ALERTS
```

The architecture can therefore be remembered as:

```text
MCP Application
      |
      v
Application Events
      |
      v
Structured Observability
      |
      +---- Logs
      +---- Metrics
      +---- Traces
      |
      v
Collector
      |
      v
Observability Backend
```

> **Core principle:** MCP protocol communication and operational logging should remain separate. For modern MCP applications, use standard application logging, structured telemetry, stderr for stdio operational logs, and OpenTelemetry-based observability rather than making new systems depend on the deprecated protocol-level Logging feature.
