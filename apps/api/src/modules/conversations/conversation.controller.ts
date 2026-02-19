import type { Request, Response } from "express"
import { makeResponse, makeResponseError } from "../../shared/response/response.js"
import { SUCCESS, BAD_REQUEST, CREATED, NOT_FOUND, INTERNAL_ERROR } from "../../shared/response/responeType.js"
import * as conversationService from "./conversation.service.js"
import { AppError } from "../../shared/util/AppError.js"
import { verifyUserAccessToken } from "../auth/auth.service.js"

// ------------------------------------------------------------------------------------------------
// Get user conversation
export async function getUserConversation(req: Request<{ id: string }>, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { id } = req.params
        // const {withMessges}

        const conversation = await conversationService.getUserConversation(userId, id)

        if (!conversation) throw new AppError(NOT_FOUND, "Conversation not found")
        makeResponse(res, SUCCESS, SUCCESS.message, { conversation })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Get user conversations
export async function getUserConversations(req: Request, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        let filter = req.query.filter as string || ""

        const conversations = await conversationService.getUserConversations(userId, filter)

        makeResponse(res, SUCCESS, SUCCESS.message, { conversations })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Start conversation
export async function startConversation(req: Request, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { secondUserId, messageContent } = req.body

        if (!secondUserId) throw new AppError(BAD_REQUEST, "Missing second user id")
        if (!messageContent) throw new AppError(BAD_REQUEST, "Missing message content")

        const conversation = await conversationService.startConversation({ startedByUserId: userId, secondUserId, messageContent })

        if (!conversation) throw new AppError(INTERNAL_ERROR, "An error occurred while starting conversation")
        makeResponse(res, SUCCESS, SUCCESS.message, { conversation })
    } catch (error: any) {
        return makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Get conversation with other user
export async function getConversationWithUser(req: Request<{ userId: string }>, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)

        const secondUserId = req.params.userId

        if (!secondUserId) throw new AppError(BAD_REQUEST, "Missing second user id")

        const conversation = await conversationService.getConversationBetweenUsers({ userId1: userId, userId2: secondUserId })

        if (!conversation) throw new AppError(INTERNAL_ERROR, "An error occurred while getting conversation with other user")
        makeResponse(res, SUCCESS, SUCCESS.message, { conversation })
    } catch (error: any) {
        return makeResponseError(res, error)
    }
}