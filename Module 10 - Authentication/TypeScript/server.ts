import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as crypto from "crypto";

const server = new McpServer({
  name: "Authentication Demo Server TS",
  version: "1.0.0",
});

// Setup default environment variables
process.env.SERVER_API_KEY = process.env.SERVER_API_KEY || "mcp-sec-secret-key-12345";
process.env.JWT_SIGNING_SECRET = process.env.JWT_SIGNING_SECRET || "super-secret-jwt-signing-key-999";

// Helper to do timing-safe comparison
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// 1. API Key Authentication Tool
server.tool(
  "get_secure_data_with_api_key",
  "Access secure data using API Key validation.",
  {
    client_api_key: z.string().describe("The API Key provided by the client/user"),
  },
  async ({ client_api_key }) => {
    const serverKey = process.env.SERVER_API_KEY || "";
    if (!safeCompare(client_api_key, serverKey)) {
      return {
        content: [{ type: "text", text: "ERROR: Unauthorized. Invalid API Key provided." }],
      };
    }
    return {
      content: [{ type: "text", text: "SUCCESS: Authenticated via API Key. Secret data: [Confidential Company Financials Q3]" }],
    };
  }
);

// 2. OAuth Exchange Simulator Tool
server.tool(
  "oauth_token_simulator",
  "Simulate exchange of authorization code for an OAuth2 Access Token and Refresh Token.",
  {
    client_id: z.string().describe("Application identifier"),
    client_secret: z.string().describe("Application secret"),
    code: z.string().describe("Authorization code received from the auth redirect"),
  },
  async ({ client_id, client_secret, code }) => {
    if (!client_id || !client_secret || !code) {
      return {
        content: [{ type: "text", text: "ERROR: Missing client credentials or authorization code." }],
      };
    }
    const accessToken = `at_sim_${crypto.randomBytes(16).toString("base64url")}`;
    const refreshToken = `rt_sim_${crypto.randomBytes(16).toString("base64url")}`;
    const expires = 3600;

    const response = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: expires,
      scope: "read:files write:files",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
    };
  }
);

// Helper for JWT signature generation (HS256)
function generateHS256Signature(message: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64url");
}

// 3. Verify JWT Tool
server.tool(
  "verify_jwt_token",
  "Verify and decode a JSON Web Token (JWT) representing user identity.",
  {
    jwt_token: z.string().describe("The header.payload.signature JWT string"),
  },
  async ({ jwt_token }) => {
    try {
      const parts = jwt_token.split(".");
      if (parts.length !== 3) {
        return {
          content: [{ type: "text", text: "ERROR: Invalid JWT format. Must contain header, payload, and signature." }],
        };
      }

      const [headerB64, payloadB64, signatureB64] = parts;
      const secret = process.env.JWT_SIGNING_SECRET || "";
      const message = `${headerB64}.${payloadB64}`;
      const expectedSignature = generateHS256Signature(message, secret);

      if (!safeCompare(signatureB64, expectedSignature)) {
        return {
          content: [{ type: "text", text: "ERROR: JWT Signature verification failed. Token may have been altered." }],
        };
      }

      const payloadString = Buffer.from(payloadB64, "base64url").toString("utf-8");
      const payload = JSON.parse(payloadString);

      if (payload.exp && payload.exp < Date.now() / 1000) {
        return {
          content: [{ type: "text", text: "ERROR: JWT has expired." }],
        };
      }

      return {
        content: [{ type: "text", text: `SUCCESS: JWT verified. User payload: ${JSON.stringify(payload)}` }],
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `ERROR: Failed to parse or verify JWT: ${e.message}` }],
      };
    }
  }
);

// 4. Generate Sample JWT Tool (For Testing)
server.tool(
  "create_sample_jwt",
  "Generate a sample valid signed JWT for testing verification.",
  {
    user_id: z.string().describe("The ID of the user"),
    username: z.string().describe("The display name of the user"),
  },
  async ({ user_id, username }) => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: user_id,
      name: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      iss: "mcp-auth-demo",
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const secret = process.env.JWT_SIGNING_SECRET || "";
    const signature = generateHS256Signature(`${headerB64}.${payloadB64}`, secret);

    return {
      content: [{ type: "text", text: `${headerB64}.${payloadB64}.${signature}` }],
    };
  }
);

// 5. Read Environment Configs Tool
server.tool(
  "read_env_configs",
  "Read non-sensitive configuration settings from environment variables.",
  {},
  async () => {
    const dbHost = process.env.DB_HOST || "localhost";
    const dbPort = process.env.DB_PORT || "5432";
    const logLevel = process.env.LOG_LEVEL || "INFO";

    const config = {
      database: {
        host: dbHost,
        port: dbPort,
        ssl_mode: "require",
      },
      logging: {
        level: logLevel,
        format: "json",
      },
      note: "API keys and JWT secrets are loaded into the system env but NOT exposed via this configuration read tool.",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
