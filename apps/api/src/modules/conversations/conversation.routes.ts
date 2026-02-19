import { Router } from "express"
import { getUserConversations, getUserConversation, startConversation, getConversationWithUser } from "./conversation.controller.js"
import { authUserMiddleware } from "../auth/auth.middleware.js"

const router = Router()

// Get user conversation
router.get("/conversations/:id", authUserMiddleware, getUserConversation)

// Get user conversations
router.get("/conversations", authUserMiddleware, getUserConversations)

// Start conversation
router.post("/conversations", authUserMiddleware, startConversation)

// Get conversation with other user
router.get("/conversations/with/:userId", authUserMiddleware, getConversationWithUser)

export default router