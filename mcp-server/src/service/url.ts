import { exec } from "child_process";

/**
 * Service for handling URL-related operations, particularly for authentication
 */
export class UrlService {
    /**
     * Base URL for authentication
     */
    private static readonly BASE_URL = "http://localhost:3000";

    /**
     * Default public key to use if none is specified
     */
    private static readonly DEFAULT_PUBKEY = "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEdxv4EjaoRj77wOz6ZDR01ttul8OCrAUVhFKNz6IcBe9ODQM17uoXTEGfchGYtKkQSIi6DIQNxv4SgDOlVK6YKg==";

    /**
     * Default delegation expiration in milliseconds (24 hours)
     */
    private static readonly DEFAULT_EXPIRATION = 86400000; // 24 hours

    /**
     * Opens the authentication URL in the system's default browser
     * @param pubkey Optional public key to include in URL parameters
     * @param expiration Optional delegation expiration time in milliseconds
     * @returns True if URL opened successfully, false otherwise
     */
    public static openAuthenticationUrl(
        pubkey: string = this.DEFAULT_PUBKEY,
        expiration: number = this.DEFAULT_EXPIRATION
    ): boolean {
        // Construct URL with query parameters
        const url = `${this.BASE_URL}?pubkey=${encodeURIComponent(pubkey)}&expiration=${expiration}`;
        console.log(`Opening authentication URL: ${url}`);

        try {
            // Open URL based on platform
            if (process.platform === "win32") {
                exec(`start ${url}`);
            } else if (process.platform === "darwin") {
                exec(`open ${url}`);
            } else if (process.platform === "linux") {
                exec(`xdg-open ${url}`);
            } else {
                console.error(`Unsupported platform: ${process.platform}`);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Error opening authentication URL: ${error}`);
            return false;
        }
    }
}