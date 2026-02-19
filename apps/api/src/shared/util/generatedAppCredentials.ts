import "dotenv/config"
import crypto, { hash } from "node:crypto"

function generatedAppCredentials(appName: string) {
    const apiKey = crypto.randomBytes(32).toString("hex")

    const apiKeyHash = crypto
        .createHmac("sha256", process.env.API_KEY_PEPPER!)
        .update(apiKey)
        .digest("hex")

    const id = crypto.randomUUID()

    return {
        appName,
        id,
        apiKey,
        apiKeyHash
    }
}
