"use server"
import { cookies } from "next/headers"
import { decodeJwt } from "jose"
import { COOKIE_LOGGED_USER } from "../../config/config"
import { LoggedUser } from "./auth.types"

export async function checkUserAuthentication() {
    try {
        const cookieStore = await cookies()

        const loggedUserCookie = cookieStore.get(COOKIE_LOGGED_USER)
        if (!loggedUserCookie) {
            return false
        }

        const loggedUser = JSON.parse(loggedUserCookie.value)

        const claims = decodeJwt(loggedUser.accessToken)
        if (!claims || !claims.exp) {
            cookieStore.delete(COOKIE_LOGGED_USER)
            return false
        }

        const now = Date.now()
        if (claims.exp > now) {
            cookieStore.delete(COOKIE_LOGGED_USER)
            return false
        }

        return true
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on check user access token:", error.message)
        return false
    }
}

export async function logout() {
    const cookieStore = await cookies()
    if (cookieStore.has(COOKIE_LOGGED_USER)) {
        cookieStore.delete(COOKIE_LOGGED_USER)
    }
}

export async function getLoggedUser(): Promise<LoggedUser | null> {
    if (await checkUserAuthentication()) {
        const cookieStore = await cookies()
        const loggedUser = cookieStore.get(COOKIE_LOGGED_USER)
        return loggedUser ? JSON.parse(loggedUser.value) : null
    }
    return null
}
