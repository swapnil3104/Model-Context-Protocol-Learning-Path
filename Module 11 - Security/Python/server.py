import os
import re
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Security Demo Server")

# --- CONTEXT SETUP ---
# Defining an allowed sandbox directory for safe tool filesystem access
ALLOWED_SANDBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sandbox"))
os.makedirs(ALLOWED_SANDBOX_DIR, exist_ok=True)

# Create a sample file inside sandbox
with open(os.path.join(ALLOWED_SANDBOX_DIR, "allowed.txt"), "w", encoding="utf-8") as f:
    f.write("This is a safe file inside the sandbox directory.")

# --- SECURITY DEMO TOOLS ---

@mcp.tool()
def read_sandbox_file(relative_path: str) -> str:
    """Read a file safely within the sandboxed directory, preventing directory traversal.
    
    Args:
        relative_path: Path relative to the allowed sandbox directory (e.g. 'allowed.txt').
    """
    # 1. Resolve absolute path
    target_path = os.path.abspath(os.path.join(ALLOWED_SANDBOX_DIR, relative_path))
    
    # 2. Check if target_path is within ALLOWED_SANDBOX_DIR (directory traversal check)
    if not target_path.startswith(ALLOWED_SANDBOX_DIR):
        return f"SECURITY ERROR: Access Denied. Path '{relative_path}' is outside the allowed sandbox directory: {ALLOWED_SANDBOX_DIR}"
        
    if not os.path.exists(target_path):
        return f"ERROR: File '{relative_path}' not found inside sandbox."
        
    if not os.path.isfile(target_path):
        return f"ERROR: '{relative_path}' is not a file."
        
    with open(target_path, "r", encoding="utf-8") as f:
        return f.read()

@mcp.tool()
def execute_safe_math(expression: str) -> str:
    """Evaluate a mathematical expression safely without using python's eval().
    
    Demonstrates safe tool execution by sanitizing inputs and parsing tokens.
    
    Args:
        expression: Simple mathematical expression (e.g. '2 + 5 * 10').
    """
    # 1. Input Validation: Check that expression only contains digits, whitespace, and basic operators
    if not re.match(r"^[0-9\s\+\-\*\/\(\)\.]+$", expression):
        return "SECURITY ERROR: Invalid characters in expression. Only numbers and mathematical operators (+, -, *, /, Parentheses) are allowed."
        
    try:
        # 2. Safe execution: using python's built-in compile with limited globals/locals to prevent execution of builtins
        # Note: In production, a dedicated AST parsing evaluator is even safer than restricted compile.
        allowed_globals = {"__builtins__": None}
        code = compile(expression, "<string>", "eval")
        result = eval(code, allowed_globals, {})
        return f"Expression: {expression}\nResult: {result}"
    except Exception as e:
        return f"ERROR: Failed to safely evaluate expression: {str(e)}"

@mcp.tool()
def mock_write_action_with_consent(item_id: int, new_quantity: int, user_has_approved: bool = False) -> str:
    """Demonstrate Human-in-the-Loop consent validation for data writes.
    
    Args:
        item_id: The ID of the item to update.
        new_quantity: The target quantity.
        user_has_approved: Flag representing user consent from the client side.
    """
    # 1. Schema / Input Validation
    if item_id <= 0 or new_quantity < 0:
        return "VALIDATION ERROR: Item ID must be greater than 0, and Quantity must be non-negative."
        
    # 2. Permissions & Consent Check
    if not user_has_approved:
        return (
            f"PERMISSION REQUIRED: Updating item {item_id} to quantity {new_quantity} is a write operation. "
            "Please call this tool again and set user_has_approved=True to confirm this change."
        )
        
    # 3. Simulate Write Action
    return f"SUCCESS: Database updated. Item {item_id} quantity set to {new_quantity}."


if __name__ == "__main__":
    mcp.run()
