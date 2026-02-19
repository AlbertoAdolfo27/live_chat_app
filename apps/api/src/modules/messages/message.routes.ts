import { Router } from "express"
import { getUserMessage, getUserMessagesByConversationId, sendMessage } from "./message.controller.js"
import { authAppMiddleware, authUserMiddleware } from "../auth/auth.middleware.js"

const router = Router()


// Get message
router.get("/messages/:id", authUserMiddleware, getUserMessage)

// Get messages by conversation id
router.get("/conversations/:conversationId/messages", authUserMiddleware, getUserMessagesByConversationId)

// Send mensage
router.post("/messages", authUserMiddleware, sendMessage)

export default router