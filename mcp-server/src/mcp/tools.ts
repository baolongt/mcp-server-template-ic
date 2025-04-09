import { IdentityStore } from "../server/express.js";
import { UrlService } from "../service/url.js";

/**
 * Authentication guard that checks if the user is authenticated before proceeding
 * @param callback The callback function to execute if authenticated
 * @returns A function that returns an error message if not authenticated, or executes the callback if authenticated
 */
const withAuthentication = (callback: Function) => async (...args: any[]) => {
    const identityStore = IdentityStore.getInstance();

    if (!identityStore.isAuthenticated()) {
        return {
            content: [
                {
                    type: "text",
                    text: "Not authenticated. Please use the 'authenticate' tool first.",
                },
            ],
        };
    }

    return callback(...args);
};

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
            // Use the UrlService to open the authentication URL with default values
            const success = UrlService.openAuthenticationUrl();

            if (!success) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Failed to open authentication URL`,
                        },
                    ],
                };
            }

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

    // Get wallet address tool (protected)
    server.tool(
        "get-wallet-address",
        "Get the wallet address connected to the server",
        {},
        withAuthentication(async () => {
            const identity = await identityStore.getIdentity();
            return {
                content: [
                    {
                        type: "text",
                        text: `User principal id ${identity.getPrincipal().toString()}`,
                    },
                ],
            };
        })
    );
}