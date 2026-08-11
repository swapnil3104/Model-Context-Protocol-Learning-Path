# MCP Authentication — Theory

## 1. Introduction

Authentication is an important part of building secure MCP (Model Context Protocol) applications.

When an MCP Client communicates with an MCP Server, the server may need to verify:

- Who is making the request
- Whether the client is allowed to connect
- Which resources the client can access
- Which tools the client is allowed to execute
- What permissions or scopes have been granted

Authentication answers the question:

> **"Who are you?"**

Authorization answers the question:

> **"What are you allowed to do?"**

In an MCP system, authentication and authorization help protect resources, tools, APIs, databases, and other sensitive systems exposed through an MCP Server.

---

## 2. Why Authentication is Important

Without authentication, an MCP Server may accept requests from unknown or unauthorized clients.

For example:

```text
Unknown Client
      │
      │ Request
      ▼
MCP Server
      │
      ▼
Sensitive Data
```

This can create security risks.

With authentication:

```text
Client
  │
  │ Authentication Credentials
  ▼
MCP Server
  │
  │ Verify Identity
  ▼
Authentication System
  │
  │ Valid
  ▼
MCP Server
  │
  ▼
Authorized Operation
```

Authentication is especially important when an MCP Server provides access to:

- Private files
- Databases
- GitHub repositories
- Email
- Slack
- Google Drive
- Calendar
- Enterprise APIs
- Internal systems
- Customer information

---

## 3. Authentication vs Authorization

Authentication and authorization are related but different concepts.

### Authentication

Authentication verifies the identity of a client or user.

Example:

```text
Who are you?

→ User: Swapnil
```

### Authorization

Authorization determines what that authenticated user is allowed to access.

Example:

```text
What can Swapnil access?

→ Read documents
→ Read calendar
→ Create calendar events
→ Cannot delete organization data
```

The flow is:

```text
Client
  │
  ▼
Authentication
  │
  │ "Who are you?"
  ▼
Identity Verified
  │
  ▼
Authorization
  │
  │ "What can you do?"
  ▼
Permission Check
  │
  ▼
MCP Operation
```

---

## 4. Basic Authentication Flow

A simplified MCP authentication flow can be represented as:

```text
┌──────────────┐
│ MCP Client   │
└──────┬───────┘
       │
       │ Authentication Request
       ▼
┌──────────────┐
│ MCP Server   │
└──────┬───────┘
       │
       │ Verify Credentials
       ▼
┌────────────────────┐
│ Identity Provider  │
└──────┬─────────────┘
       │
       │ Authentication Result
       ▼
┌──────────────┐
│ MCP Server   │
└──────┬───────┘
       │
       │ Allow / Deny
       ▼
┌──────────────┐
│ MCP Client   │
└──────────────┘
```

---

## 5. Credentials

Credentials are information used to prove identity.

Common examples include:

- API keys
- Access tokens
- OAuth access tokens
- Username and password
- Client certificates
- JWTs
- Session tokens

Example:

```text
Client
  │
  │ Authorization: Bearer <access-token>
  ▼
MCP Server
```

The server validates the credential before processing the request.

---

## 6. API Key Authentication

An API key is a secret value used to identify and authenticate a client.

Example:

```text
API_KEY=abc123...
```

A client may send the key with a request:

```text
Authorization: Bearer <API_KEY>
```

or through another server-defined authentication mechanism.

The server verifies the key:

```text
Client
  │
  │ API Key
  ▼
MCP Server
  │
  ├── Valid → Continue
  │
  └── Invalid → Reject
```

### Advantages

- Simple to implement
- Easy for server-to-server communication
- Easy to use in development

### Disadvantages

- Keys must be securely stored
- Rotation is required
- A leaked key can provide unauthorized access
- Fine-grained user permissions may be difficult

API keys should never be committed to Git repositories.

---

## 7. Bearer Token Authentication

A bearer token is a credential that grants access to whoever possesses it.

A common HTTP representation is:

```http
Authorization: Bearer ACCESS_TOKEN
```

Example:

```text
Client
  │
  │ Bearer Token
  ▼
MCP Server
  │
  │ Validate Token
  ▼
Authorization
```

The token should be treated as a secret.

If an attacker obtains a valid bearer token, they may be able to use it until it expires or is revoked.

---

## 8. OAuth

OAuth is commonly used when an application needs delegated access to another service.

For example, an MCP application may need access to:

- Google Drive
- Google Calendar
- GitHub
- Microsoft services
- Slack
- Other OAuth-enabled APIs

OAuth allows a user to grant an application specific permissions without giving the application their password.

Conceptually:

```text
User
 │
 │ Grant Permission
 ▼
Authorization Server
 │
 │ Access Token
 ▼
MCP Client
 │
 │ Authenticated Request
 ▼
MCP Server / External API
```

---

## 9. OAuth Roles

OAuth commonly involves several roles.

### Resource Owner

The user who owns the data.

Example:

```text
User
```

### Client

The application requesting access.

Example:

```text
MCP Host / MCP Client
```

### Authorization Server

The service that authenticates the user and issues tokens.

Example:

```text
OAuth Provider
```

### Resource Server

The service hosting the protected data.

Example:

```text
Google Drive API
```

Conceptually:

```text
Resource Owner
       │
       ▼
Authorization Server
       │
       │ Access Token
       ▼
OAuth Client
       │
       ▼
Resource Server
```

---

## 10. OAuth Authorization Code Flow

A common OAuth pattern is the Authorization Code flow.

Simplified sequence:

```text
1. User starts MCP application
            │
            ▼
2. MCP Client redirects user
            │
            ▼
3. Authorization Server
            │
            ▼
4. User authenticates
            │
            ▼
5. User grants permissions
            │
            ▼
6. Authorization Code returned
            │
            ▼
7. Client exchanges code
            │
            ▼
8. Access Token returned
            │
            ▼
9. Client uses token
            │
            ▼
10. Protected Resource accessed
```

The password is not directly given to the MCP Client.

---

## 11. Access Tokens

An access token represents permission to access a protected service.

Example:

```text
access_token = eyJ...
```

A client may use the token when making an authenticated request.

Example:

```http
Authorization: Bearer eyJ...
```

Access tokens should:

- Be protected
- Have appropriate expiration
- Use appropriate scopes
- Not be exposed in logs
- Not be committed to source control

---

## 12. Refresh Tokens

Access tokens are often short-lived.

A refresh token can be used to obtain a new access token without requiring the user to authenticate again.

Simplified flow:

```text
Access Token
     │
     │ Expires
     ▼
Refresh Token
     │
     ▼
Authorization Server
     │
     ▼
New Access Token
```

This provides a balance between security and usability.

---

## 13. Token Expiration

Tokens should generally have a limited lifetime.

Example:

```text
Access Token
│
├── Issued
│
├── Valid
│
├── Valid
│
└── Expired
```

When a token expires:

```text
Client
  │
  │ Expired Token
  ▼
MCP Server
  │
  ▼
401 Unauthorized
```

The client may then obtain a new token through the appropriate authentication flow.

---

## 14. JWT

JWT stands for:

**JSON Web Token**

JWTs are commonly used for representing claims about an authenticated identity.

A JWT generally contains:

```text
Header
Payload
Signature
```

Conceptually:

```text
JWT
│
├── Header
├── Payload
└── Signature
```

Example payload:

```json
{
  "sub": "user-402",
  "role": "developer",
  "exp": 1780000000
}
```

The server can validate the token and inspect its claims.

Important:

> A JWT is encoded, not inherently encrypted.

Sensitive information should not be placed in a JWT payload merely because it is base64url encoded.

---

## 15. JWT Claims

Common JWT claims include:

### `sub`

Identifies the subject.

Example:

```json
{
  "sub": "user-402"
}
```

### `iss`

Identifies the issuer.

Example:

```json
{
  "iss": "https://auth.example.com"
}
```

### `aud`

Identifies the intended audience.

Example:

```json
{
  "aud": "mcp-server"
}
```

### `exp`

Defines the expiration time.

Example:

```json
{
  "exp": 1780000000
}
```

### `iat`

Defines when the token was issued.

Example:

```json
{
  "iat": 1779990000
}
```

---

## 16. Scopes

Scopes define what an access token is allowed to do.

For example:

```text
documents:read
documents:write
calendar:read
calendar:write
```

A token may contain:

```text
documents:read
calendar:read
```

but not:

```text
documents:write
calendar:write
```

The MCP Server can use scopes to enforce permissions.

Example:

```text
Request:
Read Document

Required Scope:
documents:read

Token:
documents:read

Result:
ALLOW
```

Another request:

```text
Request:
Delete Document

Required Scope:
documents:delete

Token:
documents:read

Result:
DENY
```

---

## 17. Least Privilege

A fundamental security principle is **Least Privilege**.

The client should receive only the permissions it needs.

Bad approach:

```text
Client
   │
   ▼
Full System Access
```

Better approach:

```text
Client
   │
   ├── Read Documents
   ├── Read Calendar
   └── Read GitHub
```

If the application only needs read access, do not grant write access.

Example:

```text
documents:read
```

is preferable to:

```text
documents:*
```

when write access is unnecessary.

---

## 18. Authorization Checks

Authentication alone is not enough.

After verifying identity, the server should determine whether the authenticated identity has permission to perform the requested operation.

Example:

```text
Client
  │
  ▼
Authenticate
  │
  ▼
User Identified
  │
  ▼
Check Permission
  │
  ├── Allowed → Continue
  │
  └── Denied → Reject
```

This is particularly important for MCP Tools.

For example:

```text
Tool:
delete_file

Required Permission:
files:delete
```

The server should verify that the authenticated identity has the required permission before executing the operation.

---

## 19. Authentication for MCP Resources

Resources may contain sensitive information.

Examples:

```text
database://customers/402
file://private/report.pdf
file://internal/config.json
```

The MCP Server should determine whether the requesting identity is allowed to access the resource.

Example:

```text
Client
  │
  │ Read Resource
  ▼
MCP Server
  │
  │ Authenticate
  ▼
Identity
  │
  │ Authorize
  ▼
Resource Permission
  │
  ├── Allowed → Return Resource
  │
  └── Denied → Reject
```

---

## 20. Authentication for MCP Tools

Tools can perform operations that have side effects.

Examples:

```text
send_email
create_calendar_event
delete_file
update_database
create_github_issue
```

Authentication and authorization are especially important for these operations.

Example:

```text
Client
  │
  │ Execute Tool
  ▼
MCP Server
  │
  │ Authenticate
  ▼
Identity
  │
  │ Check Permission
  ▼
Tool
  │
  ▼
External System
```

The server should not execute privileged operations simply because a request was received.

---

## 21. HTTP Authentication

When MCP communication is implemented over HTTP-based transports, authentication information can be carried through HTTP mechanisms.

A common pattern is:

```http
Authorization: Bearer <token>
```

Conceptually:

```text
HTTP Request
│
├── Method
├── Headers
│   └── Authorization
│
└── Body
```

The server extracts and validates the authentication information before processing the MCP request.

---

## 22. HTTPS

Authentication credentials must be protected while travelling over a network.

HTTPS provides encrypted communication between the client and server.

Without TLS:

```text
Client
  │
  │ Credentials
  ▼
Network
  │
  ▼
Server
```

Credentials may be exposed to attackers who can observe the network.

With HTTPS:

```text
Client
  │
  │ Encrypted Connection
  ▼
HTTPS / TLS
  │
  ▼
MCP Server
```

Production MCP deployments should use secure transport and properly configured TLS.

---

## 23. Transport Security

Authentication should not be considered separately from transport security.

A secure system generally requires:

```text
Secure Transport
       +
Authentication
       +
Authorization
       +
Secret Management
```

All four contribute to a secure MCP deployment.

---

## 24. Environment Variables

Secrets should not normally be hard-coded into source code.

Bad:

```typescript
const API_KEY = "my-secret-key";
```

Better:

```typescript
const API_KEY = process.env.API_KEY;
```

Environment configuration:

```text
API_KEY=your-secret
```

The actual secret should be stored securely and excluded from source control.

---

## 25. `.env` Files

During local development, environment variables are commonly loaded from a `.env` file.

Example:

```text
.env
```

Content:

```env
API_KEY=your-secret-key
AUTH_SERVER_URL=https://auth.example.com
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
```

The `.env` file should normally be included in `.gitignore`.

Example:

```gitignore
.env
.env.*
```

Actual production secret management should use an appropriate secret-management solution rather than relying solely on local `.env` files.

---

## 26. Secret Management

Authentication systems depend on secrets.

Examples:

- API keys
- Client secrets
- Signing keys
- Refresh tokens
- Database passwords
- Private keys

These secrets should be protected.

Good practices:

```text
Do:
✓ Store secrets securely
✓ Rotate secrets
✓ Limit access
✓ Use environment configuration
✓ Use secret managers
✓ Monitor secret usage
```

Avoid:

```text
✗ Hard-code secrets
✗ Commit secrets to Git
✗ Share tokens in chat
✗ Log access tokens
✗ Put secrets in public repositories
```

---

## 27. Token Validation

A server should validate tokens before trusting them.

Typical checks can include:

```text
1. Token exists
2. Token format is valid
3. Token signature is valid
4. Token is not expired
5. Issuer is trusted
6. Audience is correct
7. Required scopes exist
8. Token has not been revoked where applicable
```

Conceptually:

```text
Token
  │
  ▼
Signature Valid?
  │
  ├── No → Reject
  │
  └── Yes
       │
       ▼
    Expired?
       │
       ├── Yes → Reject
       │
       └── No
            │
            ▼
       Check Scopes
            │
            ▼
       Authorization
```

---

## 28. Authentication Errors

Authentication failures should be handled clearly.

Common HTTP status codes include:

### 401 Unauthorized

Usually indicates that authentication is missing or invalid.

Example:

```text
401 Unauthorized
```

### 403 Forbidden

Usually indicates that the identity is known or authenticated, but does not have sufficient permission.

Example:

```text
403 Forbidden
```

Conceptually:

```text
No valid authentication
        │
        ▼
      401


Authenticated but not allowed
        │
        ▼
      403
```

---

## 29. Authentication and MCP Host

An MCP Host is the application that contains or coordinates the LLM and MCP Clients.

Examples of host responsibilities may include:

- Managing user interaction
- Managing MCP connections
- Handling authentication flows
- Storing credentials securely
- Requesting authorization
- Providing context to the LLM

Conceptually:

```text
User
 │
 ▼
MCP Host
 │
 ├── LLM
 │
 ├── MCP Client
 │
 └── Authentication
        │
        ▼
    MCP Server
```

---

## 30. Authentication and MCP Client

The MCP Client communicates with the MCP Server.

Depending on the deployment, the client may need to:

- Obtain an access token
- Attach authentication credentials
- Refresh expired credentials
- Handle authentication failures
- Respect scopes
- Connect only to trusted servers

Example:

```text
MCP Client
   │
   ├── Get Token
   │
   ├── Connect
   │
   ├── Authenticate
   │
   └── Request Resource / Tool
```

---

## 31. Authentication and MCP Server

The MCP Server is responsible for protecting its exposed capabilities.

A server may:

- Validate credentials
- Verify tokens
- Check scopes
- Identify the caller
- Enforce permissions
- Reject unauthorized requests
- Protect sensitive resources
- Protect privileged tools
- Audit access

Example:

```text
Incoming Request
       │
       ▼
Authentication
       │
       ▼
Identity
       │
       ▼
Authorization
       │
       ▼
MCP Resource / Tool
```

---

## 32. Authentication Architecture

A production-style architecture can look like:

```text
                         USER
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP HOST      │
                  │                  │
                  │  Application     │
                  │      +           │
                  │      LLM         │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  └────────┬─────────┘
                           │
                           │ Authenticated Request
                           ▼
                  ┌──────────────────┐
                  │    MCP SERVER    │
                  │                  │
                  │ Authentication   │
                  │       +          │
                  │ Authorization    │
                  └────────┬─────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Resources / Tools  │
                 └─────────┬──────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
          Database       GitHub        External API
```

---

## 33. OAuth-Based MCP Architecture

A simplified OAuth architecture can be represented as:

```text
                         USER
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP HOST      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  └────────┬─────────┘
                           │
                           │ Authorization
                           ▼
                  ┌──────────────────┐
                  │ Authorization    │
                  │     Server       │
                  └────────┬─────────┘
                           │
                           │ Access Token
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  └────────┬─────────┘
                           │
                           │ Bearer Token
                           ▼
                  ┌──────────────────┐
                  │    MCP SERVER    │
                  └────────┬─────────┘
                           │
                           ▼
                  Protected Resources
                  and Tools
```

---

## 34. Authentication Flow Example

Consider an MCP Server that provides access to private documents.

The user asks:

```text
Find the latest project documentation.
```

The flow can be:

```text
1. User sends request
          │
          ▼
2. MCP Host processes request
          │
          ▼
3. MCP Client needs private resource
          │
          ▼
4. Authentication is required
          │
          ▼
5. User authenticates
          │
          ▼
6. Access token is obtained
          │
          ▼
7. Client connects to MCP Server
          │
          ▼
8. Server validates token
          │
          ▼
9. Server checks permissions
          │
          ▼
10. Client reads resource
          │
          ▼
11. Resource content is returned
          │
          ▼
12. LLM uses the documentation
          │
          ▼
13. User receives answer
```

---

## 35. Authentication Security Principles

A secure MCP authentication implementation should follow important principles.

### Principle 1: Verify Identity

Always validate the identity of the caller before granting protected access.

### Principle 2: Use Least Privilege

Grant only the permissions required.

### Principle 3: Protect Secrets

Never expose credentials unnecessarily.

### Principle 4: Use Secure Transport

Protect credentials with TLS/HTTPS when communicating over networks.

### Principle 5: Validate Tokens

Do not trust tokens simply because they are present.

### Principle 6: Expire Credentials

Use appropriate token lifetimes.

### Principle 7: Rotate Secrets

Rotate long-lived credentials when appropriate.

### Principle 8: Audit Access

Record security-relevant events without logging sensitive secrets.

### Principle 9: Protect High-Risk Tools

Tools with destructive or financial side effects require strong authorization controls.

### Principle 10: Fail Securely

When authentication or authorization fails, deny access rather than accidentally allowing it.

---

## 36. Authentication Checklist

Before deploying an MCP Server, verify:

```text
Authentication
□ Authentication mechanism is defined
□ Credentials are validated
□ Tokens are verified
□ Expiration is checked
□ Issuer is validated where applicable
□ Audience is validated where applicable

Authorization
□ Permissions are defined
□ Scopes are checked
□ Least privilege is applied
□ Sensitive resources are protected
□ Sensitive tools are protected

Transport
□ HTTPS/TLS is used for network communication
□ Certificates are properly configured
□ Insecure connections are avoided

Secrets
□ Secrets are not hard-coded
□ Secrets are not committed to Git
□ Environment variables or secret managers are used
□ Tokens are not logged
□ Credentials can be rotated

Operations
□ Authentication failures are handled
□ Authorization failures are handled
□ Security events can be audited
□ Expired credentials are handled
```

---

## 37. Common Authentication Mistakes

### Mistake 1: Hard-Coding Secrets

Bad:

```typescript
const TOKEN = "secret-token";
```

Better:

```typescript
const TOKEN = process.env.TOKEN;
```

---

### Mistake 2: Committing `.env`

Never commit real credentials.

Bad:

```text
.env
```

containing:

```env
API_KEY=real-secret
```

and then pushing it to GitHub.

Use:

```gitignore
.env
```

---

### Mistake 3: Logging Tokens

Bad:

```typescript
console.log(accessToken);
```

Tokens should not appear in application logs.

---

### Mistake 4: Granting Excessive Permissions

Bad:

```text
documents:read
documents:write
documents:delete
admin:*
```

when the application only requires:

```text
documents:read
```

---

### Mistake 5: Trusting an Unverified JWT

Decoding a JWT is not the same as validating it.

The server must validate the token according to the authentication system's requirements.

---

### Mistake 6: Using HTTP for Sensitive Credentials

Credentials transmitted without adequate transport security can be exposed.

Use secure transport for production network communication.

---

## 38. Development vs Production

Authentication requirements can differ between local development and production.

### Development

A local MCP Server might use:

```text
Local Process
     │
     ▼
MCP Client
```

Authentication may be simplified depending on the environment.

### Production

A network-accessible MCP Server may require:

```text
User
 │
 ▼
MCP Host
 │
 ▼
MCP Client
 │
 │ OAuth / Token
 ▼
MCP Server
 │
 ├── Authentication
 ├── Authorization
 └── Audit
```

Production systems should apply appropriate security controls rather than assuming local development behavior is sufficient.

---

## 39. Authentication for Local MCP Servers

For local MCP servers running as a subprocess, authentication requirements may be different from those of remote network-accessible servers.

Example:

```text
MCP Host
   │
   │ Local Process
   ▼
MCP Server
```

The host may directly launch the server process.

Even in local environments, sensitive credentials used by the server should still be protected.

For example:

```text
MCP Server
    │
    ├── GitHub Token
    ├── Database Credentials
    └── API Keys
```

These secrets should not be embedded directly in source code.

---

## 40. Authentication for Remote MCP Servers

For remote MCP servers:

```text
MCP Client
     │
     │ Network
     ▼
MCP Server
```

The server may need to authenticate clients using mechanisms such as:

```text
OAuth
Bearer Tokens
API Keys
JWT
Other supported authentication mechanisms
```

Secure transport is also important.

---

## 41. Authentication and Resource Security

Resources can contain highly sensitive information.

Example:

```text
database://customers/1001
```

Potential data:

```json
{
  "name": "Customer",
  "email": "customer@example.com",
  "account": "..."
}
```

The MCP Server should not automatically expose every resource to every authenticated user.

Instead:

```text
Authenticate
     │
     ▼
Identify User
     │
     ▼
Check Resource Permission
     │
     ├── Allowed → Read
     │
     └── Denied → Reject
```

Authentication establishes identity.

Authorization protects the resource.

---

## 42. Authentication and Tool Security

Tools can be more dangerous than resources because they can cause side effects.

Example:

```text
Tool:
delete_file
```

or:

```text
Tool:
send_email
```

or:

```text
Tool:
transfer_money
```

A secure architecture should apply strong authorization controls.

Conceptually:

```text
Authenticated Client
        │
        ▼
Authorization Check
        │
        ▼
Tool Permission
        │
        ▼
Tool Execution
```

Authentication should not automatically imply permission to execute every available tool.

---

## 43. Authentication and User Identity

An authenticated request may be associated with an identity.

Example:

```text
User ID:
user-402
```

The MCP Server can use the identity for authorization.

Example:

```text
User:
user-402

Scopes:
documents:read
calendar:read

Roles:
developer
```

The server can then determine which resources and tools this identity may access.

---

## 44. Role-Based Access Control

RBAC stands for:

**Role-Based Access Control**

Instead of assigning permissions individually, users can be assigned roles.

Example:

```text
Role: Viewer

Permissions:
- documents:read
- reports:read
```

Another:

```text
Role: Developer

Permissions:
- documents:read
- documents:write
- logs:read
```

Another:

```text
Role: Admin

Permissions:
- documents:read
- documents:write
- documents:delete
- users:manage
```

The flow becomes:

```text
User
 │
 ▼
Role
 │
 ▼
Permissions
 │
 ▼
Resource / Tool
```

---

## 45. Authentication and Auditing

Security-sensitive MCP servers should consider auditing authentication and authorization events.

Useful audit events include:

```text
Authentication succeeded
Authentication failed
Authorization denied
Resource accessed
Sensitive tool executed
Token expired
Credential rotated
```

Avoid logging secrets.

Bad:

```text
Token: eyJhbGciOi...
```

Better:

```text
Authentication failed for client-402
```

---

## 46. End-to-End Authentication Flow

A complete conceptual flow is:

```text
                         USER
                           │
                           │ Request
                           ▼
                  ┌──────────────────┐
                  │    MCP HOST      │
                  │                  │
                  │       LLM        │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  └────────┬─────────┘
                           │
                           │ Authenticate
                           ▼
                  ┌──────────────────┐
                  │ Authorization    │
                  │     Server       │
                  └────────┬─────────┘
                           │
                           │ Access Token
                           ▼
                  ┌──────────────────┐
                  │    MCP CLIENT    │
                  └────────┬─────────┘
                           │
                           │ Authenticated Request
                           ▼
                  ┌──────────────────┐
                  │    MCP SERVER    │
                  │                  │
                  │  Authentication  │
                  │       +          │
                  │  Authorization   │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Resources/Tools  │
                  └────────┬─────────┘
                           │
                           ▼
                    External Systems
```

---

## 47. Authentication Learning Progression

A practical learning sequence for MCP Authentication is:

```text
1. Authentication Basics
        │
        ▼
2. Authentication vs Authorization
        │
        ▼
3. API Keys
        │
        ▼
4. Bearer Tokens
        │
        ▼
5. JWT
        │
        ▼
6. OAuth
        │
        ▼
7. Access Tokens
        │
        ▼
8. Refresh Tokens
        │
        ▼
9. Scopes
        │
        ▼
10. Permissions
        │
        ▼
11. Secure Transport
        │
        ▼
12. Secret Management
        │
        ▼
13. MCP Authentication
        │
        ▼
14. MCP Authorization
```

---

## 48. Example Repository Structure

For an MCP learning repository, authentication examples can be organized as:

```text
Module 09 - Authentication/
│
├── README.md
├── Theory.md
│
├── 01-API-Key/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── .env.example
│
├── 02-Bearer-Token/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── .env.example
│
├── 03-JWT/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── .env.example
│
├── 04-OAuth/
│   ├── README.md
│   ├── TypeScript/
│   │   ├── package.json
│   │   └── server.ts
│   └── .env.example
│
└── 05-Authorization/
    ├── README.md
    ├── TypeScript/
    │   ├── package.json
    │   └── server.ts
    └── .env.example
```

---

## 49. Key Terms

### Authentication

Process of verifying identity.

### Authorization

Process of determining permissions.

### Credential

Information used to authenticate.

### API Key

A secret value used to identify or authenticate an application.

### Access Token

A token used to access protected resources.

### Refresh Token

A credential used to obtain a new access token.

### JWT

JSON Web Token containing claims that can be validated by a server.

### OAuth

An authorization framework commonly used for delegated access.

### Scope

A permission describing what an access token can access.

### Role

A collection of permissions assigned to an identity.

### Least Privilege

Granting only the permissions required.

### TLS

Cryptographic protocol used to secure network communication.

### Secret

Sensitive authentication information that must be protected.

---

## 50. Summary

Authentication is a fundamental security concept for MCP applications.

It establishes the identity of the client or user:

```text
Authentication
       │
       ▼
"Who are you?"
```

Authorization determines what that identity is allowed to do:

```text
Authorization
       │
       ▼
"What are you allowed to do?"
```

MCP authentication can involve mechanisms such as:

```text
API Keys
Bearer Tokens
JWT
OAuth
Access Tokens
Refresh Tokens
Scopes
Roles
```

A secure MCP architecture should combine:

```text
Secure Transport
       +
Authentication
       +
Authorization
       +
Least Privilege
       +
Secret Management
       +
Token Validation
       +
Auditing
```

The complete concept can be summarized as:

```text
                 MCP SECURITY
                      │
        ┌─────────────┴─────────────┐
        │                           │
Authentication                Authorization
        │                           │
 "Who are you?"              "What can you do?"
        │                           │
        ▼                           ▼
 Credentials                   Permissions
 Tokens                        Scopes
 OAuth                         Roles
 JWT                           Policies
        │                           │
        └─────────────┬─────────────┘
                      │
                      ▼
              Protected MCP Server
                      │
             ┌────────┴────────┐
             ▼                 ▼
         Resources           Tools
             │                 │
             ▼                 ▼
          Read Data        Perform Actions
```

> **Authentication verifies identity, while authorization controls access. Together they protect MCP Servers, Resources, Tools, and the external systems connected to them.**
