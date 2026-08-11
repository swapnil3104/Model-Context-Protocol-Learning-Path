import os
import json
import sqlite3
import base64
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Resources Demo Server")

# Helper to get paths inside the data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Helper to create mock files if they don't exist
def setup_mock_data():
    # 1. Create a mock Markdown file
    md_path = os.path.join(DATA_DIR, "example.md")
    if not os.path.exists(md_path):
        with open(md_path, "w", encoding="utf-8") as f:
            f.write("# Sample Document\n\nThis is a sample markdown resource loaded dynamically from the filesystem.")

    # 2. Create a mock JSON file
    json_path = os.path.join(DATA_DIR, "example.json")
    if not os.path.exists(json_path):
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump({"status": "active", "version": "1.0.4", "features": ["mcp", "resources", "tools"]}, f, indent=2)

    # 3. Create a mock CSV file
    csv_path = os.path.join(DATA_DIR, "example.csv")
    if not os.path.exists(csv_path):
        with open(csv_path, "w", encoding="utf-8") as f:
            f.write("id,name,role\n1,Alice,Developer\n2,Bob,Product Manager\n3,Charlie,Designer\n")

    # 4. Create a mock PDF file (simulated text PDF)
    pdf_path = os.path.join(DATA_DIR, "example.pdf")
    if not os.path.exists(pdf_path):
        with open(pdf_path, "w", encoding="utf-8") as f:
            f.write("%PDF-1.4 ... (Simulated PDF Text Content for demonstration purposes)\nTitle: Model Context Protocol Guide\nContent: This document outlines resource mechanics.")

    # 5. Create a mock Database file (SQLite)
    db_path = os.path.join(DATA_DIR, "sqlite.db")
    if not os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, item TEXT, qty INTEGER)")
        cursor.execute("INSERT OR IGNORE INTO inventory (id, item, qty) VALUES (1, 'Server Rack', 5)")
        cursor.execute("INSERT OR IGNORE INTO inventory (id, item, qty) VALUES (2, 'Switch', 12)")
        cursor.execute("INSERT OR IGNORE INTO inventory (id, item, qty) VALUES (3, 'Ethernet Cable', 150)")
        conn.commit()
        conn.close()

    # 6. Create a mock Image (small 1x1 transparent PNG)
    img_path = os.path.join(DATA_DIR, "example.png")
    if not os.path.exists(img_path):
        # 1x1 transparent PNG in base64
        png_data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")
        with open(img_path, "wb") as f:
            f.write(png_data)

# Call setup helper
setup_mock_data()


# --- RESOURCES ---

@mcp.resource("file://docs/markdown")
def get_markdown_resource() -> str:
    """Read and expose a Markdown file resource."""
    md_path = os.path.join(DATA_DIR, "example.md")
    with open(md_path, "r", encoding="utf-8") as f:
        return f.read()

@mcp.resource("file://docs/json")
def get_json_resource() -> str:
    """Read and expose a JSON configuration resource."""
    json_path = os.path.join(DATA_DIR, "example.json")
    with open(json_path, "r", encoding="utf-8") as f:
        return f.read()

@mcp.resource("file://docs/csv")
def get_csv_resource() -> str:
    """Read and expose a CSV report resource."""
    csv_path = os.path.join(DATA_DIR, "example.csv")
    with open(csv_path, "r", encoding="utf-8") as f:
        return f.read()

@mcp.resource("file://docs/pdf")
def get_pdf_resource() -> str:
    """Read and expose raw text extracted from a PDF document."""
    pdf_path = os.path.join(DATA_DIR, "example.pdf")
    # For demonstration without external heavy libraries, we read the text representation
    with open(pdf_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

@mcp.resource("file://images/example-png")
def get_image_resource() -> bytes:
    """Read and expose a PNG image resource."""
    img_path = os.path.join(DATA_DIR, "example.png")
    with open(img_path, "rb") as f:
        return f.read()

@mcp.resource("db://sqlite/inventory")
def get_database_resource() -> str:
    """Fetch current inventory records from the SQLite database resource."""
    db_path = os.path.join(DATA_DIR, "sqlite.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inventory")
    rows = cursor.fetchall()
    conn.close()
    
    # Format rows as markdown table
    result = "| ID | Item | Quantity |\n|---|---|---|\n"
    for r in rows:
        result += f"| {r[0]} | {r[1]} | {r[2]} |\n"
    return result


if __name__ == "__main__":
    mcp.run()
