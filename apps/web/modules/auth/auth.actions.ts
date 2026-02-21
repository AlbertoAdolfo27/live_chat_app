"use server"
import { fetchApi } from "@/lib/api/fetch-api"
import { decodeJwt } from "jose"
import { cookies } from "next/headers"
import { COOKIE_LOGGED_USER } from "../../config/config"

type LoginProps = {
    username: string;
    password: string
}

export async function login({ username, password }: LoginProps) {
    if (!username || !password) {
        throw new Error("Missing username or password")
    }

    try {
        const responseAccessToken = await fetchApi("/auth/access-token", "POST", "", { username, password })
        if (responseAccessToken.status === "ERROR") throw new Error(responseAccessToken.error)
        const accessToken = responseAccessToken.data.accessToken

        const cookieStore = await cookies()
        const tokenClaims = decodeJwt(accessToken)
        const userId = tokenClaims.sub

        const responseUserData = await fetchApi(`/users/${userId}`, "GET", accessToken, { username, password })
        if (responseUserData.status === "ERROR") throw new Error(responseAccessToken.error)
        const loggedUser = responseUserData.data.user

        cookieStore.set(COOKIE_LOGGED_USER, JSON.stringify({
            id: loggedUser.id,
            name: loggedUser.name,
            accessToken: accessToken
        }), {
            httpOnly: true,
            sameSite: "lax",
            secure: `${process.env.NODE_ENV}` === "production"
        })
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on login:", error.message)
        throw new Error("An error occurred while login")
    }

} 