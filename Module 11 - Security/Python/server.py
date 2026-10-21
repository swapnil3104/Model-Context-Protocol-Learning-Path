import os
import ast
import operator
import pathlib
try:
    # MCP Python SDK >= 2.0 (FastMCP renamed to MCPServer)
    from mcp.server import MCPServer as FastMCP
except ImportError:
    # MCP Python SDK 1.x legacy
    from mcp.server.fastmcp import FastMCP


mcp = FastMCP("Security Demo Server")

# --- CONTEXT SETUP ---
# Defining an allowed sandbox directory for safe tool filesystem access
ALLOWED_SANDBOX_DIR = pathlib.Path(__file__).resolve().parent.parent / "sandbox"
ALLOWED_SANDBOX_DIR.mkdir(parents=True, exist_ok=True)

# Create a sample file inside sandbox
sample_file = ALLOWED_SANDBOX_DIR / "allowed.txt"
if not sample_file.exists():
    with open(sample_file, "w", encoding="utf-8") as f:
        f.write("This is a safe file inside the sandbox directory.")

# --- SECURITY DEMO TOOLS ---

@mcp.tool()
def read_sandbox_file(relative_path: str) -> str:
    """Read a file safely within the sandboxed directory, preventing directory traversal.
    
    Args:
        relative_path: Path relative to the allowed sandbox directory (e.g. 'allowed.txt').
    """
    try:
        # 1. Resolve target path completely
        target_path = (ALLOWED_SANDBOX_DIR / relative_path).resolve()
        
        # 2. Robust Directory Traversal Check:
        # Using relative_to ensures target_path is strictly a descendant of ALLOWED_SANDBOX_DIR,
        # preventing classic startsWith() sibling prefix bypasses (e.g., ../sandbox_secret).
        target_path.relative_to(ALLOWED_SANDBOX_DIR.resolve())
    except (ValueError, RuntimeError):
        return f"SECURITY ERROR: Access Denied. Path '{relative_path}' resolves outside sandbox."

    if not target_path.exists():
        return f"ERROR: File '{relative_path}' not found inside sandbox."
        
    if not target_path.is_file():
        return f"ERROR: '{relative_path}' is not a regular file."
        
    with open(target_path, "r", encoding="utf-8") as f:
        return f.read()


# Safe math AST evaluator (Replaces dangerous eval)
ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def _eval_ast_node(node):
    if isinstance(node, ast.Expression):
        return _eval_ast_node(node.body)
    elif isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    elif isinstance(node, ast.BinOp):
        op_type = type(node.op)
        if op_type not in ALLOWED_OPERATORS:
            raise ValueError(f"Operator {op_type.__name__} is not allowed.")
        left = _eval_ast_node(node.left)
        right = _eval_ast_node(node.right)
        if op_type is ast.Div and right == 0:
            raise ZeroDivisionError("Division by zero.")
        return ALLOWED_OPERATORS[op_type](left, right)
    elif isinstance(node, ast.UnaryOp):
        op_type = type(node.op)
        if op_type not in ALLOWED_OPERATORS:
            raise ValueError(f"Operator {op_type.__name__} is not allowed.")
        operand = _eval_ast_node(node.operand)
        return ALLOWED_OPERATORS[op_type](operand)
    else:
        raise ValueError(f"Unsupported AST node type: {type(node).__name__}")


@mcp.tool()
def execute_safe_math(expression: str) -> str:
    """Evaluate a mathematical expression safely via an AST visitor without using eval().
    
    Demonstrates safe tool execution by rejecting exponentiation (**), function calls,
    built-ins, and arbitrary code execution entirely.
    
    Args:
        expression: Simple mathematical expression (e.g. '2 + 5 * 10').
    """
    if len(expression) > 100:
        return "SECURITY ERROR: Expression exceeds maximum allowed length (100 characters)."

    try:
        # Parse expression into an AST without executing it
        parsed_ast = ast.parse(expression, mode='eval')
        result = _eval_ast_node(parsed_ast)
        return f"Expression: {expression}\nResult: {result}"
    except (ValueError, SyntaxError, ZeroDivisionError) as e:
        return f"ERROR: Failed to safely evaluate expression: {str(e)}"
    except Exception as e:
        return f"SECURITY ERROR: Invalid expression format: {str(e)}"


@mcp.tool()
def mock_write_action_with_consent(item_id: int, new_quantity: int) -> str:
    """Demonstrate a state-changing write operation.
    
    SECURITY PRINCIPLE:
    In the Model Context Protocol, Human-in-the-Loop (HITL) authorization MUST
    be enforced by the MCP Host Client (e.g., Claude Desktop, IDE UI prompt)
    BEFORE the tool execution request is sent to the server.
    
    Tools should not rely on autonomous LLM self-certification parameters
    (such as user_has_approved=True), because an LLM can bypass them automatically.
    
    Args:
        item_id: The ID of the item to update.
        new_quantity: The target quantity.
    """
    if item_id <= 0 or new_quantity < 0:
        return "VALIDATION ERROR: Item ID must be greater than 0, and Quantity must be non-negative."
        
    return f"SUCCESS: Database updated. Item {item_id} quantity set to {new_quantity}."


if __name__ == "__main__":
    mcp.run()
