import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Calculator",
  version: "1.0.0",
});

type CalculatorArgs = {
  a: number;
  b: number;
};

server.tool(
  "add",
  "Add two numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }: CalculatorArgs) => ({
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
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }: CalculatorArgs) => ({
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
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }: CalculatorArgs) => ({
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
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }: CalculatorArgs) => {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
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