import type { Socket } from "socket.io"
import { makeResponse, responseCallback } from "../shared/response.js"
import { request } from "../shared/request.js"

export function sendMessage(socket: Socket) {
    socket.on("message:send", async (data, callback) => {
        try {
            const { token } = socket.handshake.auth
            if (typeof data === "string") data = JSON.parse(data)

            const { conversationId, messageContent } = data

            if (!conversationId) throw new Error("Missing conversation id")
            if (!messageContent) throw new Error("Missing message content")

            const response = await request("/messages", "POST", token, data);

            emitReceivedMessage(socket, response.data.message)
            return responseCallback(callback, "success", "The Messange has been succesfully sent", response.data)
        } catch (error: any) {
            responseCallback(callback, "error", error!.message)
        }
    })
}

export function emitReceivedMessage(socket: Socket, messageData: any) {
    const conversationId = messageData.conversationId
    const conversationRoom = `conversation:${conversationId}`

    socket.to(conversationRoom).emit("message:received", makeResponse("success", "You have received a new message", { message: messageData }))
}