import "dotenv/config"
import crypto, { hash } from "node:crypto"

function generateAppCredentials(appName: string) {
    const apiKey = crypto.randomBytes(32).toString("hex")

    const apiKeyHash = crypto
        .createHmac("sha256", process.env.API_KEY_PEPPER!)
        .update(apiKey)
        .digest("hex");

    const id = crypto.randomUUID()

    return {
        name: appName,
        id,
        apiKey,
        apiKeyHash
    }
}

const appName = process.argv[2];

if (!appName) {
    console.error("App name is required");
    console.error("Usage: npm run generate:app <AppName>");
    process.exit(1);
}

const credentials = generateAppCredentials(appName);

console.log("App credentials generated");
console.log("-----------------------------");
console.log("(Save this into database)")
console.log("APP ID:", credentials.id);
console.log("APP NAME:", credentials.name);
console.log("API KEY HASH:");
console.log(credentials.apiKeyHash);
console.log("-----------------------------");
console.log("(Save this into a secury location):");
console.log("API KEY");
console.log(credentials.apiKey);