import { FORBIDDEN, NOT_FOUND } from "../../shared/response/responeType.js"
import { AppError } from "../../shared/util/AppError.js"
import { getConversation, isUserConversation } from "../conversations/conversation.service.js"
import type { MessageCreateDTO } from "./dtos/message-create.dto.js"
import type { MessageResponseDTO } from "./dtos/message-response.dto.js"
import * as messageRepository from "./message.repository.js"

// ------------------------------------------------------------------------------------------------
// Get messages by conversation id
export async function getUserMessagesByConversationId(conversationId: string, userId: string): Promise<MessageResponseDTO[]> {
    const conversation = await getConversation(conversationId)
    if (!conversation) throw new AppError(NOT_FOUND, "Conversation not found")

    return messageRepository.getUserMessagesByConversationId(conversationId, userId)
}

// ------------------------------------------------------------------------------------------------
// Get message by id
export async function getMessageBy(id: string): Promise<MessageResponseDTO | null> {
    return messageRepository.getMessageById(id)
}

// ------------------------------------------------------------------------------------------------
// Get user message
export async function getUserMessage(id: string, userId: string): Promise<MessageResponseDTO | null> {
    return messageRepository.getUserMessage(id, userId)
}

// ------------------------------------------------------------------------------------------------
// Add message
export async function sendMessage(message: MessageCreateDTO): Promise<MessageResponseDTO> {
    if (!await isUserConversation(message.senderUserId, message.conversationId)) throw new AppError(FORBIDDEN)

    return messageRepository.addMessage(message)
}