from mcp.server.fastmcp import FastMCP
import requests

mcp = FastMCP("Weather")


@mcp.tool()
def get_weather(city: str) -> str:
    """Get the current weather for a city."""

    url = f"https://wttr.in/{city}?format=j1"

    response = requests.get(url)
    response.raise_for_status()

    data = response.json()
    current = data["current_condition"][0]

    temperature = current["temp_C"]
    feels_like = current["FeelsLikeC"]
    humidity = current["humidity"]
    condition = current["weatherDesc"][0]["value"]

    return (
        f"Weather in {city}: "
        f"{condition}, "
        f"{temperature}°C, "
        f"feels like {feels_like}°C, "
        f"humidity {humidity}%"
    )


if __name__ == "__main__":
    mcp.run()