import type { Socket } from "socket.io"
import { jwtVerify, importSPKI } from 'jose'
import path from "node:path"
import fs from "node:fs"

// ------------------------------------------------------------------------------------------------
// Authentica user token
export async function userAuthMiddleware(socket: Socket) {
    try {
        const { token } = socket.handshake.auth
        if (!token) throw new Error("Missing token")

        const alg = "RS256"
        const publicKeyPath = path.resolve(process.cwd(), "secrets/api_public_key.pem")
        const publicKeyPem = fs.readFileSync(publicKeyPath, "utf-8")
        const publicKey = await importSPKI(publicKeyPem, alg)

        const { payload, protectedHeader } = await jwtVerify(token, publicKey, {
            issuer: 'urn:chat-app:api'
        })

        const userId = payload.sub;
        if (!userId) throw new Error("Invalid access token")

        return userId
    } catch (error) {
        throw new Error("Unhatorized access")
    }
}
