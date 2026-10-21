try:
    # MCP Python SDK >= 2.0 (FastMCP renamed to MCPServer)
    from mcp.server import MCPServer as FastMCP
except ImportError:
    # MCP Python SDK 1.x legacy
    from mcp.server.fastmcp import FastMCP


# Create the MCP server using the official Python SDK
mcp = FastMCP("My Python MCP Server")

@mcp.tool()
def add_numbers(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b

if __name__ == "__main__":
    mcp.run()