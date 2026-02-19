import crypto from "node:crypto"
import "dotenv/config"
import * as appRepository from "./app.repository.js"
import type { AppResponseDTO } from "./dtos/app.response.dto.js"

export async function getAppByApiKey(apiKey: string): Promise<AppResponseDTO | null> {
    const apiKeyHash = crypto
        .createHmac("sha256", process.env.API_KEY_PEPPER!)
        .update(apiKey)
        .digest("hex")

    return appRepository.getAppByApiKeyHash(apiKeyHash)
}