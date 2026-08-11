import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Prompt Templates Demo Server TS",
  version: "1.0.0",
});

// 1. Code Review Prompt
server.prompt(
  "code_review",
  "A prompt template for doing static analysis and reviewing code changes.",
  {
    code: z.string().describe("The source code to analyze"),
  },
  async ({ code }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are an expert software engineer and code reviewer.
Please perform a detailed code review of the following source code.

Analyze:
1. Potential bugs, edge cases, and runtime safety issues.
2. Code readability, styling, and structural improvements.
3. Time and space complexity optimizations.
4. Security implications or potential vulnerabilities.

Source Code:
\`\`\`
${code}
\`\`\`

Format your review with clear headings: "Summary", "Security Analysis", "Optimizations", and "Actionable Recommendations" (ordered by severity: Critical, Major, Minor).`
          }
        }
      ]
    };
  }
);

// 2. PR Review Prompt
server.prompt(
  "pr_review",
  "A prompt template for reviewing a Git Pull Request diff and description.",
  {
    diff: z.string().describe("The Git diff content"),
    description: z.string().optional().default("").describe("Optional PR description"),
  },
  async ({ diff, description }) => {
    const descPart = description ? `PR Description:\n${description}\n\n` : "";
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a tech lead reviewing a Pull Request.
${descPart}Git Diff of Changes:
\`\`\`diff
${diff}
\`\`\`

Please review this diff. Focus on:
- Intent correctness: Does the code change align with the description?
- Breaking changes: Will this break any existing public APIs or schemas?
- Missing tests: Are there test files modified or added alongside the implementation?
- Design patterns: Are modern architectural patterns and best practices followed?

Provide a concise approval decision (Approve, Request Changes, or Comment) and a numbered checklist of issues that need resolution.`
          }
        }
      ]
    };
  }
);

// 3. Summarizer Prompt
server.prompt(
  "summarizer",
  "A prompt template for summarizing long documents or logs.",
  {
    text: z.string().describe("The text content to summarize"),
    length: z.enum(["short", "medium", "long"]).optional().default("medium").describe("Desired summary length"),
  },
  async ({ text, length }) => {
    const lengthInstruction = {
      short: "Summarize in 1-2 sentences maximum.",
      medium: "Provide a brief paragraph summary followed by 3-5 bulleted highlights.",
      long: "Provide a detailed summary mapping out main arguments, supporting points, and key takeaways."
    }[length];

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a professional editor.
Please summarize the following text content.

Instruction:
${lengthInstruction}

Text Content:
---
${text}
---`
          }
        }
      ]
    };
  }
);

// 4. Meeting Notes Prompt
server.prompt(
  "meeting_notes",
  "A prompt template for converting raw meeting transcripts into structured action items.",
  {
    transcript: z.string().describe("The raw meeting transcript to process"),
  },
  async ({ transcript }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a project manager.
Please analyze the following raw meeting transcript and structure it into a clean project document.

Extract and format the following sections:
1. **Meeting Summary**: A 3-sentence high-level overview of what was discussed.
2. **Key Decisions**: Bullet points listing all finalized decisions made.
3. **Action Items**: A table with:
   | Action Item | Assignee | Priority (High/Medium/Low) |
4. **Open Questions**: Any items tabled, unresolved, or requiring follow-up.

Transcript:
"""
${transcript}
"""`
          }
        }
      ]
    };
  }
);

// 5. Research Assistant Prompt
server.prompt(
  "research_assistant",
  "A prompt template for guiding an LLM through systematic topic research.",
  {
    topic: z.string().describe("The research topic/domain"),
    depth: z.enum(["broad", "deep"]).optional().default("broad").describe("Depth of research"),
  },
  async ({ topic, depth }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are an elite research assistant specializing in technical and academic synthesis.
Please outline a research path and initial summary for the following topic:

Topic: ${topic}
Depth: ${depth === "deep" ? "deep dive into technical details" : "broad overview"}

Please provide:
1. **Executive Summary**: A concise definition and current state-of-the-art.
2. **Core Concepts & Glossary**: 3-5 key terms explained simply.
3. **Key Debates or Challenges**: Active areas of research or industrial friction.
4. **Recommended Search Queries**: Keywords and databases to query next.
5. **Structural Outline**: A proposed table of contents for a 10-page deep-dive report on this topic.`
          }
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
