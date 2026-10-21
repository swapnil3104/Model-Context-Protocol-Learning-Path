import os
import time
import hmac
import hashlib
import base64
import json
try:
    # MCP Python SDK >= 2.0 (FastMCP renamed to MCPServer)
    from mcp.server import MCPServer as FastMCP
except ImportError:
    # MCP Python SDK 1.x legacy
    from mcp.server.fastmcp import FastMCP


mcp = FastMCP("Authentication Demo Server")

# ==============================================================================
# ARCHITECTURAL NOTE ON MCP AUTHENTICATION:
# In production Model Context Protocol architectures:
# 1. Stdio Transport: Authentication is handled by the Host application passing
#    credentials via process environment variables at launch. Tools should NOT
#    ask the LLM to pass API keys or secrets in tool arguments, as this leaks
#    secrets into LLM conversation logs and context windows.
# 2. SSE / Streamable HTTP Transport: Authentication is handled at the HTTP layer
#    via standard headers (e.g. `Authorization: Bearer <token>`) during handshake.
# The tools below are educational simulations demonstrating cryptographic
# verification concepts (timing-safe compares, JWT validation, OAuth flow).
# ==============================================================================

# Default secrets for educational demonstration
DEFAULT_SERVER_API_KEY = "mcp-sec-secret-key-12345"
DEFAULT_JWT_SIGNING_SECRET = "super-secret-jwt-signing-key-999"


@mcp.tool()
def get_secure_data_with_api_key(client_api_key: str) -> str:
    """Access secure data using API Key validation.
    
    Args:
        client_api_key: The API Key provided by the client/user.
    """
    server_key = os.environ.get("SERVER_API_KEY", DEFAULT_SERVER_API_KEY)
    
    # Constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(client_api_key.strip(), server_key.strip()):
        return "ERROR: Unauthorized. Invalid API Key provided."
        
    return "SUCCESS: Authenticated via API Key. Secret data: [Confidential Company Financials Q3]"


@mcp.tool()
def oauth_token_simulator(client_id: str, client_secret: str, code: str) -> str:
    """Simulate exchange of authorization code for an OAuth2 Access Token and Refresh Token.
    
    Args:
        client_id: Application identifier.
        client_secret: Application secret.
        code: Authorization code received from the auth redirect.
    """
    if not client_id or not client_secret or not code:
        return "ERROR: Missing client credentials or authorization code."
        
    # Simulate a response from an OAuth token endpoint
    access_token = f"at_sim_{base64.b64encode(os.urandom(16)).decode('utf-8')}"
    refresh_token = f"rt_sim_{base64.b64encode(os.urandom(16)).decode('utf-8')}"
    expires_in = 3600
    
    token_response = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": expires_in,
        "scope": "read:files write:files",
        "note": "In production, tokens are exchanged by the host client out-of-band, not by the LLM."
    }
    
    return json.dumps(token_response, indent=2)


@mcp.tool()
def verify_jwt_token(jwt_token: str) -> str:
    """Verify and decode a JSON Web Token (JWT) representing user identity.
    
    Args:
        jwt_token: The header.payload.signature JWT string.
    """
    try:
        parts = jwt_token.strip().split(".")
        if len(parts) != 3:
            return "ERROR: Invalid JWT format. Must contain header, payload, and signature."
            
        header_b64, payload_b64, signature_b64 = parts
        
        # Re-sign and verify signature using configured or default secret
        secret = os.environ.get("JWT_SIGNING_SECRET", DEFAULT_JWT_SIGNING_SECRET)
        message = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = base64.urlsafe_b64encode(
            hmac.new(secret.encode('utf-8'), message, hashlib.sha256).digest()
        ).decode('utf-8').rstrip("=")
        
        # Constant-time comparison
        clean_signature = signature_b64.rstrip("=")
        if not hmac.compare_digest(clean_signature, expected_signature):
            return "ERROR: JWT Signature verification failed. Token may have been altered."
            
        # Decode payload safely with required padding
        missing_padding = len(payload_b64) % 4
        if missing_padding:
            payload_b64 += '=' * (4 - missing_padding)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode('utf-8'))
        
        # Check expiration
        if "exp" in payload and payload["exp"] < time.time():
            return "ERROR: JWT has expired."
            
        return f"SUCCESS: JWT verified. User payload: {json.dumps(payload)}"
    except Exception as e:
        return f"ERROR: Failed to parse or verify JWT: {str(e)}"


@mcp.tool()
def create_sample_jwt(user_id: str, username: str) -> str:
    """Generate a sample valid signed JWT for testing verification.
    
    Args:
        user_id: The ID of the user.
        username: The display name of the user.
    """
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "name": username,
        "iat": int(time.time()),
        "exp": int(time.time()) + 3600,
        "iss": "mcp-auth-demo"
    }
    
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).decode('utf-8').rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8').rstrip("=")
    
    secret = os.environ.get("JWT_SIGNING_SECRET", DEFAULT_JWT_SIGNING_SECRET)
    message = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = base64.urlsafe_b64encode(
        hmac.new(secret.encode('utf-8'), message, hashlib.sha256).digest()
    ).decode('utf-8').rstrip("=")
    
    return f"{header_b64}.{payload_b64}.{signature}"


@mcp.tool()
def read_env_configs() -> str:
    """Read non-sensitive configuration settings from environment variables.
    
    Demonstrates safe separation of configuration parameters from secrets.
    """
    db_host = os.environ.get("DB_HOST", "localhost")
    db_port = os.environ.get("DB_PORT", "5432")
    log_level = os.environ.get("LOG_LEVEL", "INFO")
    
    config = {
        "database": {
            "host": db_host,
            "port": db_port,
            "ssl_mode": "require"
        },
        "logging": {
            "level": log_level,
            "format": "json"
        },
        "note": "Secrets and private keys should never be returned by MCP configuration tools."
    }
    
    return json.dumps(config, indent=2)


if __name__ == "__main__":
    mcp.run()
