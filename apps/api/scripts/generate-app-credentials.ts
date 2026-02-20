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
        appName: appName,
        appId: id,
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



console.log(`App "${appName}" credentials generated`);
console.log(credentials);
console.log("-----------------------------");
console.log("(Save  \"appId\", \"appName\" and \"apiKeyHash\" into database)")
console.log("-----------------------------");
console.log("(Save \"appKey\" into a secury location");