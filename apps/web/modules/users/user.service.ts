"use server"
import { getLoggedUser } from "../auth/auth.service"
import { fetchApi } from "@/lib/api/fetch-api"
import { User, UsersAvailableForConversation } from "./user.types"

export type GetUserFilter = "without-conversation" | "without-messages" | ""
type RegisterUserProps = {
    name: string;
    username: string;
    password: string;
    email: string
}

export async function getUsers(filter: GetUserFilter = ""): Promise<UsersAvailableForConversation> {
    const loggedUser = await getLoggedUser()
    const accessToken = loggedUser?.accessToken
    if (!accessToken) {
        throw new Error("Unauthenticated user")
    }

    const querystring = (filter) ? "?" + new URLSearchParams({
        filter: filter
    }).toString() : ""

    try {
        const response = await fetchApi(`/users${querystring}`, "GET", accessToken)
        if (response.status === "ERRPR") throw new Error(response.error)
        return response.data.users
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on get users:", error.message)
        throw new Error("An error occurred while getting users")
    }
}

export async function getUser(id: string): Promise<User | null> {
    const loggedUser = await getLoggedUser()
    const accessToken = loggedUser?.accessToken
    if (!accessToken) {
        throw new Error("Unauthenticated user")
    }
    try {
        const response = await fetchApi(`/users/${id}`, "GET", accessToken)
        if (response.data.status === "ERROR") throw new Error(response.error)
        return response.data.user
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on get user:", error.message)
        throw new Error("An error occurred while getting user")
    }
}

export async function registerUser({ name, username, password, email }: RegisterUserProps): Promise<User> {
    if (!name || !username || !email || !password) {
        throw new Error("Fill in all fields")
    }

    const body = {
        name,
        username,
        password,
        email
    }
    
    try {
        const response = await fetchApi("/users", "POST", "", body)
        if (response.status === "ERROR") throw new Error(response.error)
        return response.data.user
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on register user account:", error.message)
        throw new Error("An error occurred while registering user account")
    }

}
