import { startExpressServer } from "./server/express.js";
import { startMcpServer } from "./mcp/server.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import dotenv from "dotenv";
dotenv.config({path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });


/**
 * Main function to start all services
 */
async function main() {
  try {
    // Start the Express server
    startExpressServer(9999);

    // Start the MCP server
    await startMcpServer();
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}

// Start the application
main();