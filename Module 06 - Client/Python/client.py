import asyncio
import os
import sys
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

"""
Minimal Runnable MCP Client (Python)

Demonstrates:
1. Spawning an MCP Server child process over STDIO.
2. Performing the initialize handshake & capability negotiation.
3. Discovering available tools (tools/list).
4. Executing tools (tools/call) and parsing responses.
5. Handling tool error cases (divide by zero).
6. Graceful connection teardown via async context manager.
"""


async def main():
    print("=== MCP Client (Python) Starting ===")

    # Path to target MCP server (Calculator server from Module 07)
    base_dir = Path(__file__).resolve().parent
    server_script = (
        base_dir.parent.parent / "Module 07 - Tools" / "01-Calculator" / "Python" / "server.py"
    )

    if not server_script.exists():
        print(f"Error: Target server script not found at {server_script}")
        return

    print(f"Connecting to MCP Server at: {server_script}")

    # 1. Configure STDIO transport parameters for the server subprocess
    server_params = StdioServerParameters(
        command=sys.executable,
        args=[str(server_script)],
        env=os.environ.copy(),
    )

    # 2. Establish connection and launch server subprocess
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            # 3. Protocol handshake: sends 'initialize' and 'notifications/initialized'
            print("Performing MCP handshake...")
            init_result = await session.initialize()
            server_info = getattr(init_result, "server_info", getattr(init_result, "serverInfo", None))
            server_name = server_info.name if server_info else "MCP Server"
            server_version = getattr(server_info, "version", "unknown") if server_info else "1.0.0"
            print(f"Connected to: {server_name} v{server_version}\n")


            # 4. Discover tools (tools/list)
            print("--- 1. Discovering Tools ---")
            tools_result = await session.list_tools()
            print(f"Discovered {len(tools_result.tools)} tool(s):")
            for tool in tools_result.tools:
                print(f" - {tool.name}: {tool.description}")
            print()

            # 5. Invoke tool: add(15, 27)
            print("--- 2. Calling Tool: add(a=15, b=27) ---")
            add_result = await session.call_tool("add", arguments={"a": 15, "b": 27})
            print(f"add Result: {add_result.content}")
            print()

            # 6. Invoke tool: multiply(6, 7)
            print("--- 3. Calling Tool: multiply(a=6, b=7) ---")
            mul_result = await session.call_tool("multiply", arguments={"a": 6, "b": 7})
            print(f"multiply Result: {mul_result.content}")
            print()

            # 7. Error handling demonstration: divide by zero
            print("--- 4. Error Handling: divide(a=10, b=0) ---")
            try:
                div_result = await session.call_tool("divide", arguments={"a": 10, "b": 0})
                print(f"divide Result (isError={getattr(div_result, 'isError', False)}):")
                print(f"  content: {div_result.content}")
            except Exception as e:
                print(f"Caught expected error from tool: {e}")
            print()

            print("=== All client operations completed successfully ===")


if __name__ == "__main__":
    asyncio.run(main())
