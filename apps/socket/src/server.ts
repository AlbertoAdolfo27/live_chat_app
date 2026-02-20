import "dotenv/config"
import { Server } from "socket.io"
import express from "express"
import { createServer } from "node:http"
import { userAuthMiddleware } from "./middleware/auth.middleware.js"
import { startConversation } from "./conversations/conversation.js"
import { sendMessage } from "./messages/message.js"
import { request } from "./shared/request.js"
import { makeResponse } from "./shared/response.js"

const app = express()
app.use(express.json())
const server = createServer(app)
const io = new Server(server)
const PORT = process.env.SERVER_PORT as string || 3001

// Middleware
io.use(async (socket, next) => {
    try {
        const userId = await userAuthMiddleware(socket)
        socket.data.userId = userId
        next()
    } catch (error: any) {
        next(error);
    }
});

// Connect to the socket
io.on("connection", async (socket) => {
    const userId = socket.data.userId
    const { token } = socket.handshake.auth
    const userRoom = `user:${userId}`

    // Join to user room
    socket.join(userRoom)

    try {
        const response = await request("/conversations", "GET", token)
        const conversations = response.data.conversations

        conversations.forEach((conversation: any) => {
            const conversationRoom = `conversation:${conversation.id}`
            socket.join(conversationRoom)
        });
    } catch (error) {
        console.log(error)
        io.to(userRoom).emit("conversations:sync_error", makeResponse("error", "Error on sync conversations"))
    }

    console.log("Socket rooms:", socket.rooms)

    // Start conversation
    startConversation(socket)

    // Send message
    sendMessage(socket)

})

server.listen(PORT, () => console.log("Server listening on port", PORT))