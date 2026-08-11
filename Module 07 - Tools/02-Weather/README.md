# 🌤️ Weather MCP Tool

A practical **Model Context Protocol (MCP) Weather Tool** implemented in both **Python** and **TypeScript**.

This module demonstrates how an MCP server can expose a weather function as a tool that an MCP client can discover and execute.

---

## 📁 Project Structure

```text
02-Weather/
│
├── README.md
│
├── screenshots/
│   └── weather-mcp-architecture.png
│
├── Python/
│   └── server.py
│
└── TypeScript/
    └── server.ts
```

---

## 🎯 Objective

The goal of this module is to understand how to build an MCP tool that communicates with an external API.

The Weather MCP Server exposes:

```text
get_weather(city)
```

The MCP client can discover the tool, provide a city name, and receive the current weather information.

---

## 🏗️ Architecture

The Weather MCP server was successfully tested using MCP Inspector.

### MCP Inspector — Server Connection

![Weather MCP Server Connected](/Module%2007%20-%20Tools/02-Weather/Assect/weather-server-connected.png)

### MCP Inspector — Tool Execution

![Weather MCP Tool Result](/Module%2007%20-%20Tools/02-Weather/Assect/weather-tool-result.png)

git

The complete flow is:

```text
MCP Client
    │
    │ MCP / STDIO
    ▼
Weather MCP Server
    │
    │ get_weather(city)
    ▼
Weather API
    │
    │ Weather Data
    ▼
Weather MCP Server
    │
    │ Tool Result
    ▼
MCP Client
```

---

# 🛠️ Available Tool

## `get_weather`

Returns current weather information for a specified city.

### Input

```json
{
  "city": "Mumbai"
}
```

### Example Output

```text
Weather in Mumbai: Partly cloudy, 29°C,
feels like 32°C, humidity 78%
```

### Tool Schema

```text
get_weather
└── city: string
```

---

# 🐍 Python Implementation

The Python server uses the MCP Python SDK and `FastMCP`.

File:

```text
Python/server.py
```

Basic server creation:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Weather")
```

The weather function is exposed using:

```python
@mcp.tool()
def get_weather(city: str) -> str:
    ...
```

This converts the Python function into an MCP tool that can be discovered and called by an MCP client.

---

## 📦 Python Installation

Check Python:

```bash
python --version
```

Install dependencies:

```bash
pip install mcp requests
```

Run the server:

```bash
python Python/server.py
```

---

# 🟦 TypeScript Implementation

The TypeScript server uses the official MCP TypeScript SDK.

File:

```text
TypeScript/server.ts
```

The server is created with:

```typescript
const server = new McpServer({
  name: "Weather",
  version: "1.0.0",
});
```

The weather tool is registered with:

```typescript
server.tool(
  "get_weather",
  "Get the current weather for a city",
  {
    city: z.string(),
  },
  async ({ city }) => {
    // Fetch weather data
  }
);
```

Zod is used to validate the tool input.

---

## 📦 TypeScript Installation

Move to the TypeScript directory:

```bash
cd TypeScript
```

Initialize the project:

```bash
npm init -y
```

Install MCP SDK:

```bash
npm install @modelcontextprotocol/sdk
```

Install Zod:

```bash
npm install zod
```

Install development dependencies:

```bash
npm install -D typescript tsx
```

Run the server:

```bash
npx tsx server.ts
```

---

# 🔌 MCP Transport

This example uses **STDIO transport**.

```text
MCP Client
    │
    │ Standard Input / Output
    ▼
Weather MCP Server
```

STDIO allows an MCP client such as an MCP Inspector or another MCP host to start the server process and communicate with it.

---

# 🔍 Tool Discovery

After connecting the Weather MCP Server, the MCP client can request:

```text
tools/list
```

The server returns the available tool:

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get the current weather for a city"
    }
  ]
}
```

The client can then display the tool to the user or allow an AI model to select it.

---

# ▶️ Tool Execution

When the user asks:

```text
What is the weather in Mumbai?
```

The MCP client can call:

```text
tools/call
```

with:

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "Mumbai"
  }
}
```

The server:

1. Receives the city.
2. Sends a request to the weather API.
3. Reads the weather response.
4. Formats the information.
5. Returns the result through MCP.

---

# 🔄 Complete MCP Flow

```text
                USER
                  │
                  │ "What's the weather in Mumbai?"
                  ▼
          ┌───────────────┐
          │   MCP HOST    │
          │      +        │
          │      LLM      │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │   MCP CLIENT  │
          └───────┬───────┘
                  │
                  │ tools/list
                  ▼
          ┌────────────────┐
          │ Weather MCP    │
          │ Server         │
          └───────┬────────┘
                  │
                  │ get_weather("Mumbai")
                  ▼
          ┌────────────────┐
          │   Weather API  │
          └───────┬────────┘
                  │
                  │ Weather data
                  ▼
          ┌────────────────┐
          │ Weather MCP    │
          │ Server         │
          └───────┬────────┘
                  │
                  │ Tool result
                  ▼
             MCP Client
                  │
                  ▼
                USER
```

---

# 🧪 Example

### Request

```text
Get the weather for Pune.
```

### MCP Tool Call

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "Pune"
  }
}
```

### Response

```text
Weather in Pune: Clear, 27°C,
feels like 27°C, humidity 55%
```

The exact values depend on the current weather returned by the external weather service.

---

# 🧰 Testing with MCP Inspector

The Weather server can be tested using an MCP Inspector.

Start the server:

```bash
python Python/server.py
```

Connect the server through STDIO and verify:

```text
Server
  ↓
Connected
  ↓
Tools
  ↓
get_weather
  ↓
Execute
  ↓
Weather Result
```

You can test the tool with:

```json
{
  "city": "Mumbai"
}
```

---

# 📡 MCP Operations Demonstrated

This module demonstrates two important MCP operations:

### 1. Tool Discovery

```text
tools/list
```

Used to discover:

```text
get_weather
```

### 2. Tool Execution

```text
tools/call
```

Used to execute:

```text
get_weather(city)
```

---

# ❌ Error Handling

The server should handle errors such as:

- Invalid city
- Network failure
- Weather API unavailable
- Invalid API response
- Timeout

Example:

```text
Failed to fetch weather for Mumbai
```

The server should return a useful error rather than silently failing.

---

# 📊 Verification Checklist

| Test | Status |
|---|---|
| Server starts | ✅ |
| STDIO connection | ✅ |
| MCP initialization | ✅ |
| Tool discovery | ✅ |
| `get_weather` available | ✅ |
| City input accepted | ✅ |
| External API request | ✅ |
| Weather result returned | ✅ |
| Error handling | ✅ |

---

# 🧠 Concepts Covered

This module covers:

- MCP Server
- MCP Tool
- FastMCP
- TypeScript MCP SDK
- Tool registration
- Tool discovery
- Tool execution
- Input schema
- Zod validation
- STDIO transport
- External API integration
- JSON data handling
- Error handling

---

# 🚀 Future Improvements

The Weather MCP Server can be extended with additional tools:

```text
get_weather(city)
get_forecast(city, days)
get_temperature(city)
get_humidity(city)
get_wind_speed(city)
get_weather_alerts(city)
```

Example:

```text
get_forecast("Mumbai", 5)
```

could return a multi-day forecast.

---

# 🎯 Learning Outcome

After completing this module, you should understand how to:

```text
Create MCP Server
       ↓
Register Weather Tool
       ↓
Define Input Schema
       ↓
Connect External API
       ↓
Process API Response
       ↓
Return MCP Tool Result
```

The same pattern can be reused for other MCP tools such as:

```text
Calculator
Weather
Filesystem
SQLite
GitHub
Email
Slack
Notion
Google Drive
Calendar
```

---

## 📌 Module Summary

| Component | Implementation |
|---|---|
| MCP Server | Python / TypeScript |
| Tool | `get_weather` |
| Input | City name |
| Transport | STDIO |
| External Service | Weather API |
| Main Concept | External API as MCP Tool |
