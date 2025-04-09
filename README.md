# MCP Server Template with Internet Identity Authentication

This project demonstrates a Model Context Protocol (MCP) server with Internet Identity authentication flow.

## Authentication Flow

```
┌────────────────┐     (1) Use authenticate tool     ┌────────────────┐
│                │ ────────────────────────────────> │                │
│                │                                   │                │
│   AI Client    │                                   │   MCP Server   │
│   with MCP     │                                   │                │
│   Support      │                                   │                │
│                │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │                │
└────────────────┘     (6) Authentication result     └────────────────┘
        │                                                     │
        │                                                     │ (2) Open authentication URL
        │                                                     │     with pubkey & expiration
        │                                                     ▼
        │                                           ┌────────────────┐
        │                                           │                │
        │                                           │  React Web App │
        │                                           │  (Auth UI)     │
        │                                           │                │
        │                                           └────────────────┘
        │                                                     │
        │                                                     │ (3) User authenticates
        │                                                     │     with Internet Identity
        │                                                     ▼
        │                                           ┌────────────────┐
        │                                           │                │
        │                                           │  Internet      │
        │                                           │  Identity      │
        │                                           │                │
        │                                           └────────────────┘
        │                                                     │
        │                                                     │ (4) Return delegation
        │                                                     ▼
        │                                           ┌────────────────┐
        │                                           │                │
        │                                           │  React Web App │
        │                                           │  (Auth UI)     │
        │                                           │                │
        │                                           └────────────────┘
        │                                                     │
        │                                                     │ (5) Send delegation
        │                                                     │     to MCP Server
        ▼                                                     ▼
┌────────────────┐     (7) Call other MCP tools     ┌────────────────┐
│                │ ────────────────────────────────> │                │
│                │                                   │                │
│   AI Client    │                                   │   MCP Server   │
│   with MCP     │                                   │  (Authenticated)│
│   Support      │                                   │                │
│                │ <─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │                │
└────────────────┘        (8) Tool responses         └────────────────┘
```

### How It Works

1. **Request Authentication**: The AI client calls the MCP server using the `authenticate` tool.

2. **Open Authentication URL**: The MCP server opens a browser window with the authentication URL, including:

   - `pubkey`: The public key for the delegation
   - `expiration`: The expiration time for the delegation in milliseconds

3. **User Authentication**: The React web app (Auth UI) presents an interface for the user to authenticate using Internet Identity or other supported identity providers.

4. **Delegation Creation**: After successful authentication, the web app creates a delegation chain for the MCP server using the provided public key and expiration time.

5. **Send Delegation to Server**: The web app sends the delegation chain to the MCP server at the configured endpoint.

6. **Authentication Result**: The MCP server responds to the AI client with the authentication result.

7. **Access Protected Tools**: If authentication is successful, the AI client can now call other MCP tools that require authentication.

8. **Protected Responses**: The authenticated MCP server responds to tool calls with the requested data.

## Project Structure

- `mcp-server/`: The MCP server implementation

  - Handles MCP tool registration and requests
  - Manages authentication state
  - Processes delegations from the web app

- `mcp-server-wallet-connect/`: The React web application for authentication
  - Connects to Internet Identity
  - Creates delegations for the MCP server
  - Sends delegations back to the server

## Setup Instructions

1. Configure environment variables for both projects
2. Start the MCP server
3. Start the React web application
4. Connect your AI client to the MCP server

For detailed setup instructions, see the README files in each project directory.
