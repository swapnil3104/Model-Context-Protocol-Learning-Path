try:
    # MCP Python SDK >= 2.0 (FastMCP renamed to MCPServer)
    from mcp.server import MCPServer as FastMCP
except ImportError:
    # MCP Python SDK 1.x legacy
    from mcp.server.fastmcp import FastMCP

# Create MCP server
mcp = FastMCP("Calculator")



@mcp.tool()
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b


@mcp.tool()
def subtract(a: float, b: float) -> float:
    """Subtract b from a."""
    return a - b


@mcp.tool()
def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


@mcp.tool()
def divide(a: float, b: float) -> float | str:
    """Divide a by b."""
    if b == 0:
        return "Error: Cannot divide by zero: denominator 'b' must not be 0"
    return a / b



if __name__ == "__main__":
    mcp.run()