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
    city: z.string().min(1).describe("Name of the city"),
  },
  async ({ city }) => {
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(city.trim())}?format=j1`,
        {
          headers: {
            "User-Agent": "MCP-Weather-Tool/1.0",
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );

      if (!response.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: Upstream weather service returned status ${response.status} for '${city}'.`,
            },
          ],
        };
      }

      const data = await response.json();
      const current = data?.current_condition?.[0];

      if (!current) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: No weather data returned for '${city}'.`,
            },
          ],
        };
      }

      const condition = current.weatherDesc?.[0]?.value ?? "Unknown";
      const result =
        `Weather in ${city}: ` +
        `${condition}, ` +
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
    } catch (error: any) {
      const isTimeout = error?.name === "TimeoutError";
      const errorMessage = isTimeout
        ? `Request timed out while retrieving weather for '${city}'.`
        : `Failed to fetch weather for '${city}': ${error?.message ?? String(error)}`;

      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);