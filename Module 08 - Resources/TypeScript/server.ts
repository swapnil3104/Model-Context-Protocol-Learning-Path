import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");

const server = new McpServer({
  name: "Resources Demo Server TS",
  version: "1.0.0",
});

// Helper to ensure files exist (similar to Python setup)
async function ensureMockData() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const mdPath = path.join(DATA_DIR, "example.md");
  try {
    await fs.access(mdPath);
  } catch {
    await fs.writeFile(mdPath, "# Sample Document\n\nThis is a sample markdown resource loaded dynamically from the filesystem.");
  }

  const jsonPath = path.join(DATA_DIR, "example.json");
  try {
    await fs.access(jsonPath);
  } catch {
    await fs.writeFile(jsonPath, JSON.stringify({ status: "active", version: "1.0.4", features: ["mcp", "resources"] }, null, 2));
  }

  const csvPath = path.join(DATA_DIR, "example.csv");
  try {
    await fs.access(csvPath);
  } catch {
    await fs.writeFile(csvPath, "id,name,role\n1,Alice,Developer\n2,Bob,Product Manager\n3,Charlie,Designer\n");
  }

  const pdfPath = path.join(DATA_DIR, "example.pdf");
  try {
    await fs.access(pdfPath);
  } catch {
    await fs.writeFile(pdfPath, "%PDF-1.4 ... (Simulated PDF Text Content for demonstration purposes)\nTitle: Model Context Protocol Guide\nContent: This document outlines resource mechanics.");
  }

  const pngPath = path.join(DATA_DIR, "example.png");
  try {
    await fs.access(pngPath);
  } catch {
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    await fs.writeFile(pngPath, Buffer.from(pngBase64, "base64"));
  }
}

// 1. Markdown Resource
server.resource(
  "markdown",
  "file://docs/markdown",
  async (uri) => {
    await ensureMockData();
    const mdPath = path.join(DATA_DIR, "example.md");
    const content = await fs.readFile(mdPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/markdown",
        text: content,
      }],
    };
  }
);

// 2. JSON Resource
server.resource(
  "json",
  "file://docs/json",
  async (uri) => {
    await ensureMockData();
    const jsonPath = path.join(DATA_DIR, "example.json");
    const content = await fs.readFile(jsonPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: content,
      }],
    };
  }
);

// 3. CSV Resource
server.resource(
  "csv",
  "file://docs/csv",
  async (uri) => {
    await ensureMockData();
    const csvPath = path.join(DATA_DIR, "example.csv");
    const content = await fs.readFile(csvPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/csv",
        text: content,
      }],
    };
  }
);

// 4. PDF Resource (Exposing text extraction)
server.resource(
  "pdf",
  "file://docs/pdf",
  async (uri) => {
    await ensureMockData();
    const pdfPath = path.join(DATA_DIR, "example.pdf");
    const content = await fs.readFile(pdfPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/pdf",
        text: content, // Returning text representation of PDF content
      }],
    };
  }
);

// 5. Image Resource
server.resource(
  "image",
  "file://images/example-png",
  async (uri) => {
    await ensureMockData();
    const imgPath = path.join(DATA_DIR, "example.png");
    const buffer = await fs.readFile(imgPath);
    return {
      contents: [{
        uri: uri.href,
        mimeType: "image/png",
        blob: buffer.toString("base64"),
      }],
    };
  }
);

// 6. Database Resource (Mocking SQL Query / Read)
server.resource(
  "database",
  "db://sqlite/inventory",
  async (uri) => {
    await ensureMockData();
    // Simulate reading records from SQLite DB
    const inventory = [
      { id: 1, item: "Server Rack", qty: 5 },
      { id: 2, item: "Switch", qty: 12 },
      { id: 3, item: "Ethernet Cable", qty: 150 },
    ];
    let result = "| ID | Item | Quantity |\n|---|---|---|\n";
    for (const row of inventory) {
      result += `| ${row.id} | ${row.item} | ${row.qty} |\n`;
    }
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/markdown",
        text: result,
      }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
