import prisma from "../../infra/database/prisma.js"
import { getMessageBy, sendMessage } from "../messages/message.service.js";
import type { ConversationStartDTO as ConversationCreateDTO } from "./dtos/conversation-create.dto.js";

// Select conversation with participants
const prismaSelectConversation = {
    id: true,
    createdAt: true,
    startedByUser: {
        select: {
            id: true,
            name: true
        }
    },
    participants: {
        select: {
            id: true,
            joinedAt: true,
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
}

// Select conversation with participants and messages
const prismaSelectConversationWithMessage = {
    id: true,
    createdAt: true,
    startedByUser: {
        select: {
            id: true,
            name: true
        }
    },
    participants: {
        select: {
            id: true,
            joinedAt: true,
            user: {
                select: {
                    id: true,
                    name: true
                }
            },
        }
    },
    messages: {
        select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
}

// ------------------------------------------------------------------------------------------------
// Get conversations
export async function getConversations(userId: string) {
    return prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId }
            }
        },
        select: prismaSelectConversation
    })
}

// ------------------------------------------------------------------------------------------------
// Get conversations withou messages
export async function getConversationsWithoutMessages(userId: string) {
    return prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId }
            },
            messages: {
                none: {}
            }
        },
        select: prismaSelectConversation
    })
}

// ------------------------------------------------------------------------------------------------
// Get conversations with messages
export async function getConversationsWitMessages(userId: string) {
    return prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId }
            },
            messages: {
                some: {}
            }
        },
        select: prismaSelectConversation
    })
}

// ------------------------------------------------------------------------------------------------
// Get conversation
export async function getConversation(id: string) {
    return prisma.conversation.findUnique({
        where: { id },
        select: prismaSelectConversationWithMessage
    })
}

// ------------------------------------------------------------------------------------------------
// Get user conversation
export async function getUserConversation(userId: string, conversationId: string) {
    return prisma.conversation.findFirst({
        where: {
            id: conversationId,
            participants: {
                some: {
                    userId
                }
            }
        },
        select: prismaSelectConversationWithMessage
    })
}

// ------------------------------------------------------------------------------------------------
// Get conversation between users
export async function getConversationBetweenUsers({ userId1, userId2 }: { userId1: string, userId2: string }) {
    const usersId = [userId1, userId2]
    return prisma.conversation.findFirst({
        where: {
            AND: usersId.map<any>(id => {
                return {
                    participants: {
                        some: {
                            userId: id
                        }
                    }
                }
            })
        },
        select: prismaSelectConversationWithMessage
    });
}

// ------------------------------------------------------------------------------------------------
// Get users conversations without messages
export async function getUsersConversationsWithoutMessages(usersId: [String, String]) {
    return prisma.conversation.findFirst({
        where: {
            AND: usersId.map<any>(id => {
                return {
                    participants: {
                        some: {
                            userId: id
                        }
                    },
                }
            }),
            messages: {
                none: {}
            }
        },
        select: prismaSelectConversationWithMessage
    });
}

// ------------------------------------------------------------------------------------------------
// Start conversation
export async function startConversation(newConversation: ConversationCreateDTO) {
    const conversation = await prisma.$transaction(async (tx) => {
        const conversation = await tx.conversation.create({
            data: {
                startedByUserId: newConversation.startedByUserId
            }
        })

        await tx.conversationUsers.createMany({
            data: [
                { conversationId: conversation.id, userId: newConversation.startedByUserId },
                { conversationId: conversation.id, userId: newConversation.secondUserId },
            ],
        })

        await sendMessage({ conversationId: conversation.id, senderUserId: newConversation.startedByUserId, content: newConversation.messageContent })

        return conversation
    })

    return getConversation(conversation.id);
}