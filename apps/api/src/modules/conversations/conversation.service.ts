
import { CONFLICT, NOT_FOUND } from "../../shared/response/responeType.js"
import { AppError } from "../../shared/util/AppError.js"
import { getUser } from "../users/user.service.js"
import * as conversationRepository from "./conversation.repository.js"
import type { ConversationStartDTO } from "./dtos/conversation-create.dto.js"
import type { ConversationResponseDTO } from "./dtos/conversation-response.dto.js"

const GET_CONVERSATION_FILTER = {
    withMessages: "with-messages",
    withoutMessages: "without-messages",
}
// ------------------------------------------------------------------------------------------------
// Get conversation
export async function getConversation(id: string): Promise<ConversationResponseDTO | null> {
    return conversationRepository.getConversation(id)
}

// ------------------------------------------------------------------------------------------------
// Get user conversation
export async function getUserConversation(userId: string, conversationId: string): Promise<ConversationResponseDTO | null> {
    const user = await getUser(userId)
    if (!user) throw new AppError(NOT_FOUND, "User not found")

    return conversationRepository.getUserConversation(userId, conversationId)
}

// ------------------------------------------------------------------------------------------------
// Get user conversations
export async function getUserConversations(userId: string, filter: string = ""): Promise<ConversationResponseDTO[]> {
    const user = await getUser(userId)
    if (!user) throw new AppError(NOT_FOUND, "User not found")

    switch (filter) {
        case GET_CONVERSATION_FILTER.withMessages:
            return conversationRepository.getConversationsWitMessages(userId)

        case GET_CONVERSATION_FILTER.withoutMessages:
            return conversationRepository.getConversationsWithoutMessages(userId)

        default:
            return conversationRepository.getConversations(userId)
    }
}

// ------------------------------------------------------------------------------------------------
// Start conversation
export async function startConversation(newConversation: ConversationStartDTO): Promise<ConversationResponseDTO | null> {
    const startedByUser = await getUser(newConversation.startedByUserId)
    if (!startedByUser) throw new AppError(NOT_FOUND, "Sender user not found")

    const secondUser = await getUser(newConversation.secondUserId)
    if (!secondUser) throw new AppError(NOT_FOUND, "Second user not found")

    // check if conversation between users already exists 
    const usersConversation = await conversationRepository.getConversationBetweenUsers({ userId1: newConversation.startedByUserId, userId2: newConversation.secondUserId })
    if (usersConversation) throw new AppError(CONFLICT, "Conversation between users already exists")

    return conversationRepository.startConversation(newConversation)
}

// ------------------------------------------------------------------------------------------------
// Check if is user conversation
export async function isUserConversation(userId: string, conversationId: string) {
    const userConversation = await getUserConversation(userId, conversationId)
    return (userConversation) ? true : false;
}

// ------------------------------------------------------------------------------------------------
// Get users conversations
export async function getConversationBetweenUsers({ userId1, userId2 }: { userId1: string, userId2: string }) {
    return conversationRepository.getConversationBetweenUsers({ userId1, userId2 })
}