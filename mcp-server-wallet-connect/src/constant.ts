// Get configuration from environment variables or URL params
const getConfigValue = (paramName: string, envVarName: string, defaultValue: string): string => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(paramName);

    if (paramValue) return paramValue;

    // Fall back to environment variable
    return process.env[envVarName] || defaultValue;
};

// Get backend public key from URL param or environment variable
export const BACKEND_PUBKEY = getConfigValue(
    'pubkey',
    'REACT_APP_BACKEND_PUBKEY',
    'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEdxv4EjaoRj77wOz6ZDR01ttul8OCrAUVhFKNz6IcBe9ODQM17uoXTEGfchGYtKkQSIi6DIQNxv4SgDOlVK6YKg=='
);

// Get delegation expiration time from URL param or environment variable
// Default: 1 day (1000 * 60 * 60 * 24 = 86400000 ms)
export const DELEGATE_EXPIRATION = parseInt(
    // default is 1 day
    getConfigValue('expiration', 'REACT_APP_DELEGATE_EXPIRATION', '86400000')
);

// Backend URL from environment variable
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9999';