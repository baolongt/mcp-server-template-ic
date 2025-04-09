import { startExpressServer } from "./server/express.js";
import { startMcpServer } from "./mcp/server.js";

/**
 * Main function to start all services
 */
async function main() {
  try {
    // Start the Express server
    startExpressServer(9000);

    // Start the MCP server
    await startMcpServer();
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}

// Start the application
main();