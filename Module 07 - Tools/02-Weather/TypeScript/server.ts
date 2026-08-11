import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Weather",
  version: "1.0.0",
});

server.tool(
  "get_weather",
  "Get the current weather for a city",
  {
    city: z.string().describe("Name of the city"),
  },
  async ({ city }) => {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather for ${city}`);
    }

    const data = await response.json();

    const current = data.current_condition[0];

    const result =
      `Weather in ${city}: ` +
      `${current.weatherDesc[0].value}, ` +
      `${current.temp_C}°C, ` +
      `feels like ${current.FeelsLikeC}°C, ` +
      `humidity ${current.humidity}%`;

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);