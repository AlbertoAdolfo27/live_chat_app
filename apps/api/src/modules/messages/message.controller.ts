import type { Request, Response } from "express"
import * as messageService from "./message.service.js"
import { AppError } from "../../shared/util/AppError.js"
import { BAD_REQUEST, NOT_FOUND, SUCCESS } from "../../shared/response/responeType.js"
import { makeResponse, makeResponseError } from "../../shared/response/response.js"
import { verifyUserAccessToken } from "../auth/auth.service.js"

// ------------------------------------------------------------------------------------------------
// Get message
export async function getUserMessage(req: Request<{ id: string }>, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { id } = req.params

        const message = await messageService.getUserMessage(id, userId)
        if (!message) throw new AppError(NOT_FOUND, "Message not found")
        makeResponse(res, SUCCESS, SUCCESS.message, { message })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Get messages by conversation id
export async function getUserMessagesByConversationId(req: Request<{ conversationId: string }>, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { conversationId } = req.params

        const messages = await messageService.getUserMessagesByConversationId(conversationId, userId)
        makeResponse(res, SUCCESS, SUCCESS.message, { messages })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Add message
export async function sendMessage(req: Request, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { conversationId, messageContent } = req.body

        if (!conversationId) throw new AppError(BAD_REQUEST, "Missing conversartion id")
        if (!messageContent) throw new AppError(BAD_REQUEST, "Missing message content")

        const message = await messageService.sendMessage({ conversationId, senderUserId: userId, content: messageContent })
        makeResponse(res, SUCCESS, SUCCESS.message, { message })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}