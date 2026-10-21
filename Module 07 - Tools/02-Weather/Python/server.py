try:
    # MCP Python SDK >= 2.0 (FastMCP renamed to MCPServer)
    from mcp.server import MCPServer as FastMCP
except ImportError:
    # MCP Python SDK 1.x legacy
    from mcp.server.fastmcp import FastMCP

from urllib.parse import quote
import httpx


mcp = FastMCP("Weather")


@mcp.tool()
async def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    if not city or not city.strip():
        return "Error: City name must not be empty."

    # URL-encode city parameter to handle spaces and special characters safely
    encoded_city = quote(city.strip())
    url = f"https://wttr.in/{encoded_city}?format=j1"

    headers = {
        "User-Agent": "MCP-Weather-Tool/1.0",
    }

    try:
        # Use async httpx client with explicit timeout to avoid freezing the event loop
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code == 404:
                return f"Error: City '{city}' was not found."
            response.raise_for_status()

            data = response.json()
            conditions = data.get("current_condition")
            if not conditions:
                return f"Error: No weather condition data available for '{city}'."

            current = conditions[0]
            temperature = current.get("temp_C", "N/A")
            feels_like = current.get("FeelsLikeC", "N/A")
            humidity = current.get("humidity", "N/A")
            desc_list = current.get("weatherDesc", [])
            condition = desc_list[0].get("value", "Unknown") if desc_list else "Unknown"

            return (
                f"Weather in {city}: "
                f"{condition}, "
                f"{temperature}°C, "
                f"feels like {feels_like}°C, "
                f"humidity {humidity}%"
            )
    except httpx.TimeoutException:
        return f"Error: Request timed out while retrieving weather for '{city}'."
    except httpx.HTTPStatusError as e:
        return f"Error: Upstream weather service returned status {e.response.status_code}."
    except Exception as e:
        return f"Error: Failed to fetch weather for '{city}': {str(e)}"


if __name__ == "__main__":
    mcp.run()