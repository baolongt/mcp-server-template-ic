import { exec } from "child_process";
import { IdentityStore } from "../server/express.js";

/**
 * Registers all MCP tools for the authentication flow
 * @param server The MCP server instance
 */
export function registerMcpTools(server: any): void {
    const identityStore = IdentityStore.getInstance();

    // Check authentication status
    server.tool(
        "check-authentication",
        "Check if the server is authenticated",
        {},
        async () => {
            return {
                content: [
                    {
                        type: "text",
                        text: `Server is ${identityStore.isAuthenticated() ? "authenticated" : "not authenticated"}`,
                    },
                ],
            };
        }
    );

    // Authenticate tool
    server.tool(
        "authenticate",
        "Authenticate the server. This action will open a browser window to authenticate the server",
        {},
        async () => {
            const url = "http://localhost:3000";

            // Open browser for authentication
            exec(`open ${url}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error opening URL: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
            });

            // Wait for authentication to complete
            const now = new Date();
            const expirationDate = new Date(now.getTime() + 60 * 1000); // 1 minute from now

            while (new Date() < expirationDate) {
                if (identityStore.isAuthenticated()) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Authentication successful`,
                            },
                        ],
                    };
                }

                // Wait for 1 second before checking again
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            // If the loop ends and identity is still null, return failure
            return {
                content: [
                    {
                        type: "text",
                        text: `Authentication failed. Identity was not set within 1 minute.`,
                    },
                ],
            };
        }
    );

    // List proposals tool
    server.tool(
        "get-wallet-address",
        "Get the wallet address connected to the server",
        {},
        async () => {
            if (!identityStore.isAuthenticated()) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Server is not authenticated`,
                        },
                    ],
                };
            }

            const identity = await identityStore.getIdentity();

            console.log(identity.getPrincipal().toString());


            return {
                content: [
                    {
                        type: "text",
                        text: `User principal id ${identity.getPrincipal().toString()}`,
                    },
                ],
            };
        }
    );
}