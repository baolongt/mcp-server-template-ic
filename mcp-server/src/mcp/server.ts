import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerMcpTools } from "./tools.js";

/**
 * Creates and initializes the MCP server
 * @returns The created MCP server instance
 */
export function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "weather",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });

    // Register all tools
    registerMcpTools(server);

    return server;
}

/**
 * Starts the MCP server with stdio transport
 */
export async function startMcpServer(): Promise<void> {
    const server = createMcpServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}