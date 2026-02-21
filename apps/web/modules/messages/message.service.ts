"use server"
import { fetchApi } from "@/lib/api/fetch-api"
import { getLoggedUser } from "../auth/auth.service"
import { Message } from "./message.types"

export async function sendMessage(conversationId: string, message: string): Promise<Message | null> {
    try {
        const loggedUser = await getLoggedUser()
        const accessToken = loggedUser?.accessToken ?? ""

        if (!message) {
            throw Error("Missing message content")
        }
        const body = {
            messageContent: message,
            conversationId
        }

        const response = await fetchApi("/messages", "POST", accessToken, body)
        return response.data.message
        // eslint-disable-next-line
    } catch (error: any) {
        console.log("Error on send message:", error.message)
        return null
    }

}