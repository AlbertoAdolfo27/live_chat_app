import { jwtVerify, SignJWT, importPKCS8, importSPKI } from "jose"
import { UNAUTHORIZED, UNAUTHORIZED_APP } from "../../shared/response/responeType.js"
import { AppError } from "../../shared/util/AppError.js"
import { getUserPasswordHash } from "../users/user.repository.js"
import type { Request } from "express"
import { verify } from "argon2"
import fs from "node:fs"
import path from "node:path"
import { getAppByApiKey } from "../apps/app.service.js"
import { Activity } from "react"

// sign alg
const alg = 'RS256';

// Get jwt access token
export async function getUserAccessToken(username: string, password: string): Promise<string> {

    const user = await getUserPasswordHash(username)
    if (!user) throw new AppError(UNAUTHORIZED)

    // Verify password hash
    const verifyPassword = await verify(user.password, password,)
    if (!verifyPassword) throw new AppError(UNAUTHORIZED)

    // start sign jwt
    const privateKeyPath = path.resolve(process.cwd(), "secrets/private_key.pem")
    const privateKeyPem = fs.readFileSync(privateKeyPath, "utf-8")
    const privateKey = await importPKCS8(privateKeyPem, alg)

    const jwtAccessToken = await new SignJWT()
        .setProtectedHeader({ alg })
        .setSubject(user.id)
        .setIssuedAt()
        .setIssuer('urn:chat-app:api')
        .setExpirationTime('24h')
        .sign(privateKey)

    return jwtAccessToken
}

// ------------------------------------------------------------------------------------------------
// Verify access token
export async function verifyUserAccessToken(req: Request): Promise<{ userId: string }> {
    try {
        const { authorization } = req.headers
        if (!authorization) throw new AppError(UNAUTHORIZED, "Missing authorization")

        const [, token] = authorization.split(" ")
        if (!token) throw new AppError(UNAUTHORIZED, "Invalid access token")

        const publicKeyPath = path.resolve(process.cwd(), "secrets/public_key.pem")
        const publicKeyPem = fs.readFileSync(publicKeyPath, "utf-8")
        const publicKey = await importSPKI(publicKeyPem, alg)

        const { payload, protectedHeader } = await jwtVerify(token, publicKey, {
            issuer: 'urn:chat-app:api'
        })

        const userId = payload.sub;
        if (!userId) throw new AppError(UNAUTHORIZED, "Invalid access token")

        return { userId }
    } catch (error) {
        throw new AppError(UNAUTHORIZED)
    }
}

// ------------------------------------------------------------------------------------------------
// Verify app api key
export async function verifyAppApiKey(req: Request) {
    const apiKey = req.header("X-API-KEY")
    if (!apiKey) throw new AppError(UNAUTHORIZED_APP, "Missing api key")

    const app = await getAppByApiKey(apiKey)
    if (!app) throw new AppError(UNAUTHORIZED_APP)
    if (!app.isActive) throw new AppError(UNAUTHORIZED_APP)

    return true
}
