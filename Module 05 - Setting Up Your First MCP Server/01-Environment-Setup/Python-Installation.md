# Installing Python

Although the official MCP SDK is commonly used with Node.js, Python also has excellent MCP libraries and is widely used for AI applications.

---

## Download Python

Visit

https://python.org/downloads

Download the latest stable version.

---

## Important

During installation check

✅ Add Python to PATH

before clicking Install.

---

## Verify Installation

```bash
python --version
```

Example

```
Python 3.12.5
```

Check pip

```bash
pip --version
```

Example

```
pip 25.x.x
```

---

## Create a Virtual Environment

```bash
python -m venv .venv
```

Activate

Windows

```bash
.venv\Scripts\activate
```

Linux/macOS

```bash
source .venv/bin/activate
```

---

## Install a Package

```bash
pip install requests
```

Example

```bash
pip install mcp
```

---

## Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

## Why Python?

Python is popular for

- AI
- Machine Learning
- LLMs
- Automation
- Data Processing
- MCP integrations

---

## Troubleshooting

### python is not recognized

Reinstall Python.

Enable PATH.

---

### pip not found

Run

```bash
python -m ensurepip
```

---

## Next

Install Visual Studio Code.