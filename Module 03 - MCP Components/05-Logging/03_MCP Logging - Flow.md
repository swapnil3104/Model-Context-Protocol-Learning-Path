# MCP Logging - Flow

> A complete flow guide for Logging in the Model Context Protocol (MCP), covering historical protocol-level Logging, modern application logging, stdio logging, structured logs, correlation, traces, telemetry collection, error handling, security logging, and production observability.

---

# Table of Contents

1. Introduction
2. Logging Flow Overview
3. Important MCP Version Note
4. Historical MCP Logging Flow
5. Modern MCP Logging Flow
6. Basic Logging Flow
7. MCP Host to Server Flow
8. Application Event Flow
9. Historical Logging Capability Flow
10. Historical Logging Level Flow
11. Historical `logging/setLevel` Flow
12. Historical `notifications/message` Flow
13. Severity Filtering Flow
14. Stdio Logging Flow
15. stdout vs stderr Flow
16. Streamable HTTP Logging Flow
17. Structured Logging Flow
18. Request ID Flow
19. Trace ID Flow
20. Logs, Metrics, and Traces Flow
21. OpenTelemetry Flow
22. Tool Execution Logging Flow
23. Resource Access Logging Flow
24. Prompt Execution Logging Flow
25. Error Logging Flow
26. Security Logging Flow
27. Audit Logging Flow
28. Sensitive Data Redaction Flow
29. Centralized Logging Flow
30. Multi-Server Logging Flow
31. Agentic Workflow Logging Flow
32. Production Logging Flow
33. Complete Historical Flow
34. Complete Modern Flow
35. End-to-End Stdio Flow
36. End-to-End HTTP Flow
37. Troubleshooting Flow
38. Recommended Logging Flow
39. Best Practices
40. Common Flow Mistakes
41. Final Flow Summary

---

# 1. Introduction

Logging flow describes how an operational event moves from an MCP application to a logging or observability system.

A basic flow is:

```text
MCP Server
    |
    v
Application Event
    |
    v
Logger
    |
    v
Log Handler
    |
    v
Log Collector
    |
    v
Observability Backend
```

The complete system can include:

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
  v
Application Logging
  |
  +---- Logs
  +---- Metrics
  +---- Traces
```

---

# 2. Logging Flow Overview

The overall modern flow is:

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
                           v
                    APPLICATION EVENT
                           |
                           v
                         LOGGER
                           |
                           v
                 STRUCTURED LOG EVENT
                           |
               +-----------+-----------+
               |           |           |
               v           v           v
             LOGS       METRICS      TRACES
               |           |           |
               +-----------+-----------+
                           |
                           v
                  TELEMETRY COLLECTOR
                           |
                           v
                OBSERVABILITY BACKEND
                    /       |       \
                   /        |        \
                  v         v         v
               SEARCH   DASHBOARD   ALERT
```

---

# 3. Important MCP Version Note

The MCP specification revision dated **2026-07-28** deprecated the protocol-level Logging feature.

Therefore, two flows should be understood:

```text
Historical Flow
```

and:

```text
Modern Recommended Flow
```

Historical protocol-level Logging included:

```text
logging capability
logging/setLevel
notifications/message
```

Modern MCP applications should generally use:

```text
Application Logging
Structured Logs
stderr for stdio
Metrics
Traces
OpenTelemetry
Observability Backend
```

---

# 4. Historical MCP Logging Flow

The historical protocol-level flow was approximately:

```text
USER
 |
 v
MCP HOST
 |
 v
MCP CLIENT
 |
 | initialize
 v
MCP SERVER
 |
 | logging capability
 v
MCP CLIENT
 |
 | logging/setLevel
 v
MCP SERVER
 |
 v
APPLICATION EVENT
 |
 v
LOGGER
 |
 v
SEVERITY FILTER
 |
 +---- Below Level ----> DROP
 |
 +---- Allowed --------> notifications/message
                              |
                              v
                         MCP CLIENT
                              |
                              v
                           MCP HOST
                              |
                              v
                             USER
```

---

# 5. Modern MCP Logging Flow

The modern recommended flow is:

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
 v
APPLICATION LOGIC
 |
 v
STRUCTURED LOGGER
 |
 +----------------+
 |                |
 v                v
LOG EVENT      TRACE EVENT
 |                |
 v                v
COLLECTOR      TRACE COLLECTOR
 |                |
 +-------+--------+
         |
         v
OBSERVABILITY BACKEND
         |
   +-----+-----+
   |     |     |
   v     v     v
SEARCH DASHBOARD ALERTS
```

---

# 6. Basic Logging Flow

The simplest application logging flow is:

```text
Application
    |
    v
Event Happens
    |
    v
Logger
    |
    v
Log Level Check
    |
    +---- Reject ----> Drop
    |
    +---- Accept ----> Handler
                           |
                           v
                         Output
```

Example:

```text
Tool starts
    |
    v
logger.info()
    |
    v
INFO accepted
    |
    v
stderr / collector
```

---

# 7. MCP Host to Server Flow

A normal MCP request begins with the user.

```text
User
 |
 | Request
 v
MCP Host
 |
 | Determine required action
 v
MCP Client
 |
 | MCP Request
 v
MCP Server
 |
 | Execute operation
 v
Tool / Resource / Prompt
```

Logging occurs alongside this flow:

```text
MCP Request
    |
    +----------------------+
    |                      |
    v                      v
MCP Server            Request Logger
    |                      |
    v                      v
Operation             Log Event
```

---

# 8. Application Event Flow

When something happens inside the server:

```text
Application Event
       |
       v
Logger
       |
       v
Log Level
       |
       v
Structured Record
       |
       v
Handler
       |
       v
Collector
       |
       v
Backend
```

Example:

```text
Tool execution starts
        |
        v
tool_started
        |
        v
INFO
        |
        v
JSON log
        |
        v
Collector
```

---

# 9. Historical Logging Capability Flow

Historically, the server could advertise Logging support during initialization.

```text
MCP Client
    |
    | initialize
    v
MCP Server
    |
    | capabilities
    v
Logging Capability
    |
    v
MCP Client
```

Conceptually:

```json
{
  "capabilities": {
    "logging": {}
  }
}
```

This belongs to the historical protocol-level Logging design.

---

# 10. Historical Logging Level Flow

Historically, the client could control the minimum logging level.

```text
MCP Client
    |
    | Desired level = INFO
    v
MCP Server
    |
    v
Configure Logger
    |
    v
Receive Application Events
    |
    v
Filter Events
```

For example:

```text
Configured Level = WARNING

DEBUG       -> DROP
INFO        -> DROP
NOTICE      -> DROP
WARNING     -> SEND
ERROR       -> SEND
CRITICAL    -> SEND
ALERT       -> SEND
EMERGENCY   -> SEND
```

---

# 11. Historical `logging/setLevel` Flow

Detailed historical flow:

```text
MCP CLIENT
    |
    | logging/setLevel
    | level = INFO
    v
MCP SERVER
    |
    v
Update Logging Configuration
    |
    v
Logger receives events
    |
    v
Severity Filter
    |
    +---- DEBUG ----> DROP
    |
    +---- INFO -----> ACCEPT
    |
    +---- WARNING --> ACCEPT
    |
    +---- ERROR ----> ACCEPT
```

The client did not directly receive every event simply because an application generated it.

The configured level controlled filtering.

---

# 12. Historical `notifications/message` Flow

Once a log event passed filtering:

```text
MCP SERVER
    |
    v
Logger
    |
    v
Severity Filter
    |
    v
Accepted Log Event
    |
    v
notifications/message
    |
    v
MCP CLIENT
    |
    v
MCP HOST
```

Conceptually:

```text
Server
  |
  | Notification
  v
Client
  |
  v
Host / UI
```

---

# 13. Severity Filtering Flow

Severity filtering reduces unnecessary logging.

```text
                 LOG EVENT
                     |
                     v
               Determine Level
                     |
                     v
             Compare Threshold
                     |
          +----------+----------+
          |                     |
          v                     v
       Too Low               Allowed
          |                     |
          v                     v
        DROP                  SEND
                                |
                                v
                              Handler
```

Example:

```text
Threshold = ERROR

DEBUG      -> DROP
INFO       -> DROP
WARNING    -> DROP
ERROR      -> SEND
CRITICAL   -> SEND
```

---

# 14. Stdio Logging Flow

Stdio has a special flow because stdout carries MCP protocol messages.

```text
                    MCP SERVER
                         |
             +-----------+-----------+
             |                       |
             v                       v
          stdout                  stderr
             |                       |
             v                       v
       MCP Protocol            Application Logs
             |                       |
             v                       v
        MCP Client              Collector
```

Complete flow:

```text
MCP Client
    |
    | stdin
    v
MCP Server
    |
    | Process Request
    v
Application
    |
    +----------------------+
    |                      |
    v                      v
stdout                   stderr
    |                      |
    v                      v
MCP Response          Operational Log
    |                      |
    v                      v
MCP Client             Log Collector
```

---

# 15. stdout vs stderr Flow

## Correct flow

```text
MCP Protocol
    |
    v
stdout
    |
    v
MCP Client
```

and:

```text
Application Logs
    |
    v
stderr
    |
    v
Terminal / Collector
```

## Incorrect flow

```text
Application
    |
    v
print("Server started")
    |
    v
stdout
    |
    v
MCP Client
```

This can interfere with protocol communication.

---

# 16. Streamable HTTP Logging Flow

HTTP-based MCP servers have a different transport path.

```text
MCP Client
    |
    | HTTP
    v
MCP Server
    |
    v
Application Logic
    |
    +---- Logger
    |
    +---- Metrics
    |
    +---- Traces
```

Telemetry then flows independently:

```text
MCP Server
    |
    +---- Logs
    |
    +---- Metrics
    |
    +---- Traces
            |
            v
         Collector
            |
            v
       Observability Backend
```

---

# 17. Structured Logging Flow

Structured logging flow:

```text
Application Event
       |
       v
Logger
       |
       v
Add Metadata
       |
       v
Structured Record
       |
       v
JSON Serialization
       |
       v
Log Handler
       |
       v
Collector
       |
       v
Storage / Search
```

Example:

```json
{
  "level": "INFO",
  "event": "tool_completed",
  "tool": "search_books",
  "duration_ms": 120,
  "request_id": "abc123"
}
```

---

# 18. Request ID Flow

Request IDs connect events belonging to one operation.

```text
Request
   |
   | request_id=abc123
   v
MCP Server
   |
   +---- Request Log
   |
   +---- Tool Log
   |
   +---- Database Log
   |
   +---- Response Log
```

Example:

```text
request_id=abc123
        |
        +---- request_started
        |
        +---- tool_started
        |
        +---- database_query
        |
        +---- tool_completed
        |
        +---- request_completed
```

---

# 19. Trace ID Flow

Trace IDs connect operations across multiple services.

```text
MCP Host
   |
   | trace_id=xyz
   v
MCP Client
   |
   | trace_id=xyz
   v
MCP Server
   |
   | trace_id=xyz
   v
Tool
   |
   | trace_id=xyz
   v
External API
```

The trace allows operators to reconstruct the complete distributed operation.

---

# 20. Logs, Metrics, and Traces Flow

A complete observability flow is:

```text
                    APPLICATION
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
           LOGS       METRICS      TRACES
             |           |           |
             +-----------+-----------+
                         |
                         v
                   COLLECTOR
                         |
                         v
               OBSERVABILITY SYSTEM
```

The three signals answer different questions:

```text
Logs
  |
  +---- What happened?

Metrics
  |
  +---- How much / how often?

Traces
  |
  +---- Where did the operation spend time?
```

---

# 21. OpenTelemetry Flow

Modern telemetry can use OpenTelemetry.

```text
MCP Server
    |
    +---- Logs
    |
    +---- Metrics
    |
    +---- Traces
            |
            v
      OpenTelemetry SDK
            |
            v
      OpenTelemetry Collector
            |
            v
      Observability Backend
```

The collector can:

```text
Receive
Process
Filter
Enrich
Batch
Export
```

---

# 22. Tool Execution Logging Flow

Detailed tool flow:

```text
MCP Client
    |
    | tools/call
    v
MCP Server
    |
    v
Tool Handler
    |
    v
Log: tool_started
    |
    v
Tool Execution
    |
    +---- External API
    |
    +---- Database
    |
    +---- File System
    |
    v
Tool Result
    |
    v
Log: tool_completed
    |
    v
MCP Client
```

Failure flow:

```text
Tool
 |
 v
Exception
 |
 v
Error Handler
 |
 v
Log: tool_failed
 |
 v
MCP Client
```

---

# 23. Resource Access Logging Flow

Resource flow:

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
    v
Log: resource_access_started
    |
    v
Read Resource
    |
    v
Log: resource_access_completed
    |
    v
Return Resource
    |
    v
MCP Client
```

Avoid logging entire sensitive resource contents.

---

# 24. Prompt Execution Logging Flow

Prompt flow:

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
    v
Log: prompt_started
    |
    v
Generate Prompt
    |
    v
Log: prompt_completed
    |
    v
Return Prompt
    |
    v
MCP Client
```

Useful metadata:

```text
prompt_name
request_id
duration
status
```

---

# 25. Error Logging Flow

Error flow:

```text
Application Operation
        |
        v
      Error
        |
        v
   Error Handler
        |
        v
Structured Error
        |
        +---- error_type
        +---- request_id
        +---- trace_id
        +---- operation
        +---- duration
        |
        v
      Logger
        |
        v
     Collector
        |
        v
Observability Backend
        |
        v
      Alert
```

Example:

```text
API Timeout
    |
    v
TimeoutError
    |
    v
tool_failed
    |
    v
ERROR
    |
    v
Alerting System
```

---

# 26. Security Logging Flow

Security events should follow a protected flow:

```text
Security Event
      |
      v
Security Logger
      |
      v
Filter
      |
      v
Redaction
      |
      v
Secure Collector
      |
      v
Protected Storage
      |
      v
Security Analysis
```

Example:

```text
Authentication Failure
       |
       v
Security Log
       |
       v
Redaction
       |
       v
Storage
       |
       v
Security Dashboard
```

---

# 27. Audit Logging Flow

Audit events have a separate flow:

```text
Sensitive Action
      |
      v
Audit Logger
      |
      v
Audit Record
      |
      v
Protected Storage
      |
      v
Audit Search
```

Examples:

```text
Permission changed
Configuration changed
Sensitive operation executed
Administrative action performed
```

Audit logs should not be treated exactly like temporary debug logs.

---

# 28. Sensitive Data Redaction Flow

Sensitive data protection should happen before logs leave the application.

```text
Application
    |
    v
Log Event
    |
    v
Redaction Layer
    |
    +---- Secret detected
    |         |
    |         v
    |      Remove / Mask
    |
    +---- Safe data
              |
              v
        Structured Log
              |
              v
           Collector
```

Example:

```text
Original:

{
  "api_key": "SECRET_VALUE"
}
```

After redaction:

```text
{
  "api_key": "[REDACTED]"
}
```

---

# 29. Centralized Logging Flow

For multiple MCP servers:

```text
MCP Server A
     |
     v
     Logs
     |
     +------------------+
                        |
MCP Server B            |
     |                  |
     v                  |
     Logs               |
     |                  |
     +------------------+----> Collector
                        |
MCP Server C            |
     |                  |
     v                  |
     Logs               |
     +------------------+
                        |
                        v
                 Observability
                    Backend
```

This allows centralized search.

---

# 30. Multi-Server Logging Flow

A single user request may call several MCP servers.

```text
USER
 |
 v
HOST
 |
 v
CLIENT
 |
 +---------> MCP Server A
 |               |
 |               v
 |             Logs
 |
 +---------> MCP Server B
 |               |
 |               v
 |             Logs
 |
 +---------> MCP Server C
                 |
                 v
               Logs
                 |
                 +------------+
                              |
                              v
                         Collector
                              |
                              v
                      Observability
```

Correlation should connect the events:

```text
trace_id = xyz
request_id = abc123
```

---

# 31. Agentic Workflow Logging Flow

An agent may perform multiple steps.

```text
USER
 |
 v
AGENT
 |
 v
Plan
 |
 +---- Tool Call 1
 |       |
 |       v
 |    MCP Server
 |
 +---- Tool Result
 |
 +---- Next Step
 |
 +---- Tool Call 2
 |       |
 |       v
 |    MCP Server
 |
 +---- Tool Result
 |
 v
Final Response
```

Logging:

```text
Agent
 |
 v
workflow_started
 |
 v
step_started
 |
 v
tool_started
 |
 v
tool_completed
 |
 v
step_completed
 |
 v
workflow_completed
```

All events should be correlated where practical.

---

# 32. Production Logging Flow

A production flow:

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
            TOOLS       RESOURCES     PROMPTS
              |            |            |
              +------------+------------+
                           |
                           v
                    APPLICATION LOGIC
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
           LOGS         METRICS        TRACES
             |             |             |
             +-------------+-------------+
                           |
                           v
                  TELEMETRY COLLECTOR
                           |
                           v
                OBSERVABILITY BACKEND
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          SEARCH       DASHBOARD       ALERTS
```

---

# 33. Complete Historical Flow

```text
                             USER
                               |
                               v
                           MCP HOST
                               |
                               v
                           MCP CLIENT
                               |
                               | initialize
                               v
                           MCP SERVER
                               |
                               | logging capability
                               v
                           MCP CLIENT
                               |
                               | logging/setLevel
                               | level = INFO
                               v
                           MCP SERVER
                               |
                               v
                       APPLICATION EVENT
                               |
                               v
                             LOGGER
                               |
                               v
                       SEVERITY FILTER
                               |
                     +---------+---------+
                     |                   |
                     v                   v
                  REJECT              ACCEPT
                     |                   |
                     v                   v
                   DROP          notifications/message
                                         |
                                         v
                                    MCP CLIENT
                                         |
                                         v
                                      MCP HOST
                                         |
                                         v
                                        USER
```

---

# 34. Complete Modern Flow

```text
                             USER
                               |
                               v
                           MCP HOST
                               |
                               v
                           MCP CLIENT
                               |
                               | MCP Request
                               v
                           MCP SERVER
                               |
                               v
                        REQUEST CONTEXT
                               |
                               +---- request_id
                               |
                               +---- trace_id
                               |
                               v
                       APPLICATION LOGIC
                               |
                +--------------+--------------+
                |              |              |
                v              v              v
              TOOL          RESOURCE        PROMPT
                |              |              |
                +--------------+--------------+
                               |
                               v
                         LOG EVENT
                               |
                               v
                     STRUCTURED LOGGER
                               |
                +--------------+--------------+
                |              |              |
                v              v              v
              LOGS          METRICS         TRACES
                |              |              |
                +--------------+--------------+
                               |
                               v
                     TELEMETRY COLLECTOR
                               |
                               v
                   OBSERVABILITY BACKEND
                               |
                +--------------+--------------+
                |              |              |
                v              v              v
             SEARCH       DASHBOARD         ALERT
```

---

# 35. End-to-End Stdio Flow

Complete stdio flow:

```text
                           USER
                             |
                             v
                         MCP HOST
                             |
                             v
                         MCP CLIENT
                             |
                             | stdin
                             v
                         MCP SERVER
                             |
                             v
                       Request Handler
                             |
                             v
                        Tool Execution
                             |
                   +---------+---------+
                   |                   |
                   v                   v
              MCP Response        Log Event
                   |                   |
                   v                   v
                stdout              stderr
                   |                   |
                   v                   v
              MCP CLIENT        Log Collector
                   |                   |
                   v                   v
                 HOST          Observability Backend
                   |
                   v
                  USER
```

Critical rule:

```text
stdout = protocol
stderr = operational logs
```

---

# 36. End-to-End HTTP Flow

HTTP flow:

```text
                           USER
                             |
                             v
                         MCP HOST
                             |
                             v
                         MCP CLIENT
                             |
                             | HTTP
                             v
                      HTTP / MCP SERVER
                             |
                             v
                       Request Handler
                             |
                             v
                         Tool / Logic
                             |
                +------------+------------+
                |            |            |
                v            v            v
              LOGS        METRICS       TRACES
                |            |            |
                +------------+------------+
                             |
                             v
                        COLLECTOR
                             |
                             v
                    OBSERVABILITY SYSTEM
```

Protocol responses remain on the HTTP transport while telemetry is handled separately.

---

# 37. Troubleshooting Flow

When an MCP operation fails:

```text
User Reports Problem
        |
        v
Find request_id
        |
        v
Search Logs
        |
        v
Find Error Event
        |
        v
Find trace_id
        |
        v
Inspect Trace
        |
        v
Identify Failed Component
        |
        +---- MCP Client
        |
        +---- MCP Server
        |
        +---- Tool
        |
        +---- Database
        |
        +---- External API
        |
        v
Identify Root Cause
        |
        v
Fix Problem
        |
        v
Verify Through Logs / Metrics / Traces
```

---

# 38. Recommended Logging Flow

For a new MCP application:

```text
MCP Host
    |
    v
MCP Client
    |
    v
MCP Server
    |
    v
Application Logic
    |
    v
Structured Logger
    |
    +---- request_id
    +---- trace_id
    +---- operation
    +---- duration
    +---- status
    |
    v
Telemetry
    |
    +---- Logs
    +---- Metrics
    +---- Traces
    |
    v
OpenTelemetry / Collector
    |
    v
Observability Backend
    |
    +---- Search
    +---- Dashboard
    +---- Alerts
```

For stdio:

```text
MCP Protocol
    |
    v
stdout

Operational Logging
    |
    v
stderr
```

---

# 39. Best Practices

## 1. Keep protocol and logging separate

```text
Protocol → stdout / transport
Logs     → stderr / telemetry pipeline
```

---

## 2. Use structured logs

Prefer:

```json
{
  "event": "tool_completed",
  "tool": "search_books",
  "duration_ms": 120
}
```

over:

```text
Search books completed in 120 ms
```

Structured logs are easier to search and analyze.

---

## 3. Use request IDs

```text
request_id=abc123
```

This connects all events belonging to one request.

---

## 4. Use trace IDs for distributed systems

```text
trace_id=xyz
```

This connects operations across services.

---

## 5. Redact sensitive information

Never intentionally log:

```text
Passwords
API Keys
Access Tokens
Private Keys
Secrets
Sensitive Personal Data
```

---

## 6. Use appropriate log levels

Common levels:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

Use the lowest useful level for normal operational events.

---

## 7. Log important lifecycle events

Useful events include:

```text
server_started
server_stopped
client_connected
request_started
request_completed
tool_started
tool_completed
tool_failed
resource_accessed
prompt_completed
connection_failed
```

---

## 8. Use logs, metrics, and traces together

```text
Logs    → detailed events
Metrics → numerical health
Traces  → request journey
```

---

## 9. Avoid excessive logging

Do not automatically log:

```text
Every variable
Every function call
Large payloads
Full prompts
Full resources
Secrets
```

---

## 10. Define retention policies

Different log categories may require different retention periods.

```text
Debug Logs
    ↓
Short Retention

Application Logs
    ↓
Medium Retention

Audit Logs
    ↓
Longer Retention
```

---

# 40. Common Flow Mistakes

## Mistake 1: Printing to stdout in stdio

Incorrect:

```text
print()
   |
   v
stdout
   |
   v
MCP Client
```

Correct:

```text
logger
   |
   v
stderr
```

---

## Mistake 2: Logging secrets

Incorrect:

```text
api_key=sk-secret-value
```

Correct:

```text
api_key=[REDACTED]
```

---

## Mistake 3: No correlation

Without IDs:

```text
Request A
Request B
Request C
```

can become difficult to distinguish.

Use:

```text
request_id
trace_id
```

---

## Mistake 4: Mixing user output and logs

Keep:

```text
Tool Result
```

separate from:

```text
Operational Log
```

---

## Mistake 5: Relying on deprecated protocol-level Logging for new systems

The MCP 2026-07-28 specification deprecated protocol-level Logging.

New systems should generally use standard application logging and modern observability.

---

# 41. Final Flow Summary

## Historical Flow

```text
MCP Client
    |
    | logging/setLevel
    v
MCP Server
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
    v
notifications/message
    |
    v
MCP Client
    |
    v
MCP Host
```

---

## Modern Flow

```text
MCP Client
    |
    v
MCP Server
    |
    v
Application Logic
    |
    v
Structured Logger
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
            |
      +-----+-----+
      |     |     |
      v     v     v
   Search Dashboard Alerts
```

---

## Stdio Flow

```text
MCP Server
    |
    +---- stdout ----> MCP Protocol ----> MCP Client
    |
    +---- stderr ----> Logs -----------> Collector
```

---

## Distributed Flow

```text
User
 |
 v
MCP Host
 |
 v
MCP Client
 |
 +---- Server A
 |
 +---- Server B
 |
 +---- Server C
 |
 v
Telemetry Collector
 |
 +---- Logs
 +---- Metrics
 +---- Traces
 |
 v
Observability Backend
 |
 +---- Search
 +---- Dashboards
 +---- Alerts
```

---

## Core Concept

The complete modern MCP logging flow can be remembered as:

```text
EVENT
  |
  v
LOGGER
  |
  v
STRUCTURED TELEMETRY
  |
  +---- LOGS
  +---- METRICS
  +---- TRACES
  |
  v
COLLECTOR
  |
  v
OBSERVABILITY BACKEND
  |
  +---- SEARCH
  +---- DASHBOARD
  +---- ALERT
```

> **Core principle:** Keep MCP protocol communication separate from operational logging. For stdio MCP servers, keep stdout clean for protocol traffic and send operational logs to stderr. For modern production systems, use structured logs, request/trace correlation, metrics, traces, and an OpenTelemetry-based observability pipeline rather than building new systems around the deprecated protocol-level Logging feature.
