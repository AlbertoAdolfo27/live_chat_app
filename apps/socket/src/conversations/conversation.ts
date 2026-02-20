import type { Server, Socket } from "socket.io"
import { responseCallback } from "../shared/response.js"
import "dotenv/config"
import { request } from "../shared/request.js"
import { emitReceivedMessage } from "../messages/message.js"

export function startConversation(socket: Socket) {
    socket.on("conversation:start", async (data, callback) => {
        try {
            const { token } = socket.handshake.auth
            if (typeof data === "string") data = JSON.parse(data)

            const { secondUserId, messageContent } = data

            if (!secondUserId) throw new Error("Missing second user id")
            if (!messageContent) throw new Error("Missing message content")

            const response = await request("/conversations", "POST", token, data);

            emitReceivedMessage(socket, response.data.message)
            return responseCallback(callback, "success", "The Conversation has ben succesfully started", response.data)
        } catch (error: any) {
            responseCallback(callback, "error", error!.message)
        }
    })
}