# Contributing to the MCP Learning Path

Thank you for your interest in contributing to the **Model Context Protocol (MCP) Learning Path**! 🚀

This repository is an open educational resource designed to help developers master building, running, and securing MCP hosts, clients, and servers. Contributions from the developer community help keep this guide up-to-date, accurate, and comprehensive.

---

## 🗺️ How You Can Contribute

If you want to contribute, you can do so in several ways:

### 1. Improve Educational Content
- Fix typos or grammatical errors in the module `README.md` files.
- Clarify technical explanations in the **Theory**, **Architecture**, or **Flow** guides.
- Add additional diagrams (using Mermaid.js) to explain protocol sequences.

### 2. Expand Reference Server Implementations
- Add new server configurations or languages (e.g., Rust, Go, Java MCP servers).
- Fix bugs in existing Python (`FastMCP`) or TypeScript (`@modelcontextprotocol/sdk`) servers.
- Propose new module exercises or code challenges.

### 3. Report Bugs & Share Suggestions
- Open an **Issue** to report any broken links, incorrect command lines, or runtime issues.
- Recommend updates when the underlying MCP protocol specification changes.

---

## 🛠️ Getting Started Locally

To contribute code or content changes, follow these steps:

1. **Fork the Repository**: Create a personal copy of this repository on GitHub.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Model-Context-Protocol-Learning-Path.git
   cd Model-Context-Protocol-Learning-Path
   ```
3. **Create a Topic Branch**:
   ```bash
   git checkout -b feature/your-awesome-contribution
   ```
4. **Make and Test Your Changes**:
   - Run Python servers to make sure they load cleanly without import errors.
   - Compile TypeScript files using `tsx` or `npm run dev` to verify type safety.
5. **Commit Your Changes**: Keep your commit messages clear, descriptive, and prefix them appropriately (e.g., `docs: fix typo in module 08` or `feat: add rust server for module 09`).

---

## 📋 Coding & Document Style Guides

To maintain consistency across this learning path:

### Code Standards
- **Python**: Follow PEP 8 guidelines. Write clear docstrings for all Tools and Prompts, as FastMCP uses docstrings for LLM descriptions.
- **TypeScript**: Ensure TypeScript files compile without compiler warnings or implicit `any` assertions.

### Documentation Standards
- Keep the standard educational layout for module READMEs (`Learning Objectives`, `Topics Covered`, `Skills Gained`, `Suggested Folder Structure`, `Module Outcome`, `💡 Key Takeaways`).
- Separate distinct theoretical chapters using horizontal rules (`---`).

---

## 🤝 Code of Conduct

We are committed to providing a welcoming, safe, and collaborative learning environment. When interacting, please be respectful, open to feedback, and constructive in reviews.

Happy learning, and thank you for helping build the future of agentic AI communication! 🤖✨
