# Module 09 — Reusable Prompt Templates

> Learn how to declare, structure, and expose custom Prompt Templates from your MCP Server so that AI hosts can fetch and use them dynamically.

---

## 📌 Module Overview

In **Module 09**, we explore how to standardize prompting workflows using MCP. 

Prompts allow MCP Servers to expose reusable instruction sets and templates directly to the LLM Host. Instead of hardcoding prompts inside your front-end or client wrapper, servers can maintain context-specific templates (like Code Review guidelines or Summarizers) and make them discoverable.

---

## 📖 Topics & Examples Covered

Here are the custom prompt templates implemented in this module:

### 1. Code Review
- Structured guidelines for static code analysis, highlighting performance, code smell detection, and styling consistency.

### 2. PR Review
- Automated pull request template checklists assessing security boundaries, test coverage, and documentation changes.

### 3. Summarizer
- Condensing long paragraphs, technical logs, or documents into bulleted summaries with key highlights.

### 4. Meeting Notes
- Standardized templates to parse transcripts, extract action items, track assignees, and generate summaries.

### 5. Research Assistant
- In-depth prompt frameworks guiding LLMs to perform secondary research, cross-reference articles, and formulate formal papers.

---

## 🛠️ Implementation Example

Exposing a prompt template from an MCP Server (TypeScript SDK example):

```typescript
server.prompt(
  "code-review",
  "Run a code review on a specific file",
  {
    code: {
      type: "string",
      description: "The code content to review",
      required: true,
    },
  },
  async ({ code }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review the following code for bugs, architectural issues, and optimizations:\n\n\`\`\`\n${code}\n\`\`\``
          }
        }
      ]
    };
  }
);
```
