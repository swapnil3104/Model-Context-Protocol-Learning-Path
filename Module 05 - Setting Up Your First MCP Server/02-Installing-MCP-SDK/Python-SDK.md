# Installing the MCP SDK for Python

Python is widely used for AI applications and provides an official MCP SDK for building MCP servers.

---

# Step 1 — Create a Project

```bash
mkdir my-python-mcp
```

```bash
cd my-python-mcp
```

---

# Step 2 — Create a Virtual Environment

```bash
python -m venv .venv
```

---

# Activate Environment

### Windows

```bash
.venv\Scripts\activate
```
![Screenshot](./Images/Screenshot%202026-08-01%20151521.png )

### Linux / macOS

```bash
source .venv/bin/activate
```

---

# Step 3 — Install the MCP SDK

```bash
pip install mcp
```

---

# Step 4 — Verify Installation

```bash
pip show mcp
```
![Screenshot](./Images/Screenshot%202026-08-01%20151716.png)
Example:

```
Name: mcp
Version: x.x.x
```

---

# Recommended Project Structure

```
my-python-mcp/

├── server.py
├── requirements.txt
├── .venv/
└── README.md
```

---

# Save Dependencies

```bash
pip freeze > requirements.txt
```

---

# Install from Requirements

```bash
pip install -r requirements.txt
```

---

# Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

# Common Issues

### pip Not Found

```bash
python -m ensurepip
```

---

### Virtual Environment Not Activating

Delete `.venv` and recreate it:

```bash
python -m venv .venv
```

---

### Module Not Found

Install again:

```bash
pip install mcp
```

---

# Next

You'll create your first MCP server using the installed SDK.