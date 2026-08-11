from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Prompt Templates Demo Server")

# --- PROMPT TEMPLATES ---

@mcp.prompt()
def code_review(code: str) -> str:
    """A prompt template for doing static analysis and reviewing code changes."""
    return f"""You are an expert software engineer and code reviewer.
Please perform a detailed code review of the following source code.

Analyze:
1. Potential bugs, edge cases, and runtime safety issues.
2. Code readability, styling, and structural improvements.
3. Time and space complexity optimizations.
4. Security implications or potential vulnerabilities.

Source Code:
```
{code}
```

Format your review with clear headings: "Summary", "Security Analysis", "Optimizations", and "Actionable Recommendations" (ordered by severity: Critical, Major, Minor).
"""

@mcp.prompt()
def pr_review(diff: str, description: str = "") -> str:
    """A prompt template for reviewing a Git Pull Request diff and description."""
    desc_part = f"PR Description:\n{description}\n\n" if description else ""
    return f"""You are a tech lead reviewing a Pull Request.
{desc_part}Git Diff of Changes:
```diff
{diff}
```

Please review this diff. Focus on:
- Intent correctness: Does the code change align with the description?
- Breaking changes: Will this break any existing public APIs or schemas?
- Missing tests: Are there test files modified or added alongside the implementation?
- Design patterns: Are modern architectural patterns and best practices followed?

Provide a concise approval decision (Approve, Request Changes, or Comment) and a numbered checklist of issues that need resolution.
"""

@mcp.prompt()
def summarizer(text: str, length: str = "medium") -> str:
    """A prompt template for summarizing long documents or logs."""
    length_instruction = {
        "short": "Summarize in 1-2 sentences maximum.",
        "medium": "Provide a brief paragraph summary followed by 3-5 bulleted highlights.",
        "long": "Provide a detailed summary mapping out main arguments, supporting points, and key takeaways."
    }.get(length.lower(), "Provide a balanced summary.")

    return f"""You are a professional editor.
Please summarize the following text content.

Instruction:
{length_instruction}

Text Content:
---
{text}
---
"""

@mcp.prompt()
def meeting_notes(transcript: str) -> str:
    """A prompt template for converting raw meeting transcripts into structured action items."""
    return f"""You are a project manager.
Please analyze the following raw meeting transcript and structure it into a clean project document.

Extract and format the following sections:
1. **Meeting Summary**: A 3-sentence high-level overview of what was discussed.
2. **Key Decisions**: Bullet points listing all finalized decisions made.
3. **Action Items**: A table with:
   | Action Item | Assignee | Priority (High/Medium/Low) |
4. **Open Questions**: Any items tabled, unresolved, or requiring follow-up.

Transcript:
\"\"\"
{transcript}
\"\"\"
"""

@mcp.prompt()
def research_assistant(topic: str, depth: str = "broad") -> str:
    """A prompt template for guiding an LLM through systematic topic research."""
    return f"""You are an elite research assistant specializing in technical and academic synthesis.
Please outline a research path and initial summary for the following topic:

Topic: {topic}
Depth: {depth} (e.g. broad overview or deep dive into technical details)

Please provide:
1. **Executive Summary**: A concise definition and current state-of-the-art.
2. **Core Concepts & Glossary**: 3-5 key terms explained simply.
3. **Key Debates or Challenges**: Active areas of research or industrial friction.
4. **Recommended Search Queries**: Keywords and databases to query next.
5. **Structural Outline**: A proposed table of contents for a 10-page deep-dive report on this topic.
"""


if __name__ == "__main__":
    mcp.run()
