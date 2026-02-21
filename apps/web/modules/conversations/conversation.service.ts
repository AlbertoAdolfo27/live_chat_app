"use server"
import { getLoggedUser } from "../auth/auth.service"
import { fetchApi } from "@/lib/api/fetch-api"
import { Conversation } from "./conversation.types"

export type GetConversationFilter = "without-messages" | "with-messages" | ""

export async function getConversations(filter: GetConversationFilter = ""): Promise<Conversation[]> {
    try {
        const loggedUser = await getLoggedUser()
        if (!loggedUser) {
            throw new Error("Unauthenticated user")
        }

        const querystring = (filter) ? "?" + new URLSearchParams({
            "filter": filter
        }).toString() : ""

        const response = await fetchApi(`/conversations${querystring}`, "GET", loggedUser.accessToken)
        return response.data.conversations
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on get conversations:", error.message)
        return []
    }
}

export async function getConversation(id: string): Promise<Conversation | null> {
    try {
        const loggedUser = await getLoggedUser()
        if (!loggedUser) {
            throw new Error("Unauthenticated user")
        }

        const response = await fetchApi(`/conversations/${id}`, "GET", loggedUser.accessToken)
        return response.data.conversation
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on get conversation:", error.message)
        return null
    }
}

export async function getConversationWithUser(secondUserId: string): Promise<Conversation | null> {
    try {
        const loggedUser = await getLoggedUser()
        if (!loggedUser) {
            throw new Error("Unauthenticated user")
        }

        const response = await fetchApi(`/conversations/with/${secondUserId}`, "GET", loggedUser.accessToken, { secondUserId })
        return response.data.conversation
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on get conversation:", error.message)
        return null
    }
}

export async function startConversation(secondUserId: string, messageContent: string): Promise<Conversation | null> {
    try {
        const loggedUser = await getLoggedUser()
        if (!loggedUser) {
            throw new Error("Unauthenticated user")
        }

        const body = {
            secondUserId,
            messageContent
        }

        const response = await fetchApi(`/conversations`, "POST", loggedUser?.accessToken, body)
        return response.data.conversation
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on start conversation:", error.message)
        return null
    }
}
