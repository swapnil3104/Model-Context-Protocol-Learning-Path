import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Calculator",
  version: "1.0.0",
});

server.tool(
  "add",
  "Add two numbers",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a + b),
      },
    ],
  })
);

server.tool(
  "subtract",
  "Subtract b from a",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number to subtract"),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a - b),
      },
    ],
  })
);

server.tool(
  "multiply",
  "Multiply two numbers",
  {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: String(a * b),
      },
    ],
  })
);

server.tool(
  "divide",
  "Divide a by b",
  {
    a: z.number().describe("Numerator"),
    b: z.number().describe("Denominator (must not be zero)"),
  },
  async ({ a, b }) => {
    if (b === 0) {
      // In MCP, return isError: true so the LLM receives the error text and can adjust
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Error: Cannot divide by zero.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: String(a / b),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);