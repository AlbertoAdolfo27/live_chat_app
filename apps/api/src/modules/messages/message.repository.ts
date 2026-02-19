import prisma from "../../infra/database/prisma.js";
import type { MessageCreateDTO } from "./dtos/message-create.dto.js";

const prismaSelectMessage = {
    id: true,
    conversationId: true,
    content: true,
    createdAt: true,
    sender: {
        select: {
            id: true,
            name: true
        }
    }
}

// ------------------------------------------------------------------------------------------------
// Get message by id
export async function getMessageById(id: string) {
    return prisma.message.findUnique({
        where: {
            id
        },
        select: prismaSelectMessage
    })
}

// ------------------------------------------------------------------------------------------------
// Get user message 
export async function getUserMessage(id: string, userId: string) {
    return prisma.message.findUnique({
        where: {
            id,
            conversation: {
                participants: {
                    some: {
                        userId
                    }
                }
            }
        },
        select: prismaSelectMessage
    })
}

// ------------------------------------------------------------------------------------------------
// Get messages
export async function getUserMessagesByConversationId(conversationId: string, userId: string) {
    return prisma.message.findMany({
        where: {
            conversationId,
            conversation: {
                participants: {
                    some: {
                        userId
                    }
                }
            }
        },
        select: prismaSelectMessage
    })
}

// ------------------------------------------------------------------------------------------------
// Add message
export async function addMessage(message: MessageCreateDTO) {
    return prisma.message.create({
        data: message,
        select: prismaSelectMessage
    })
}


