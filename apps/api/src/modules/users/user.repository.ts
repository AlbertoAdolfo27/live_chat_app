import prisma from "../../infra/database/prisma.js"
import { getUserConversations } from "../conversations/conversation.service.js"
import type { UserCreateDTO } from "./dto/user-create.dto.js"
import type { UserUpdateDTO } from "./dto/user-update-dto.js"

export const primaSafeSelectUser = {
    id: true,
    name: true,
    username: true,
    createdAt: true,
    updatedAt: true
}

// ------------------------------------------------------------------------------------------------
// Get users
export async function getUsers() {
    return prisma.user.findMany({
        select: primaSafeSelectUser
    })
}

// ------------------------------------------------------------------------------------------------
// Get users without conversation started
export async function getUsersWithoutConversation(forUserId: string) {
    const userConversations = await getUserConversations(forUserId)
    const userConversationsId = userConversations.map(conversation => conversation.id)

    return prisma.user.findMany({
        select: primaSafeSelectUser,
        where: {
            id: {
                not: forUserId
            },
            NOT: {
                conversationUsers: {
                    some: {
                        conversationId: {
                            in: userConversationsId
                        }
                    }
                }
            }
        }
    })
}

// ------------------------------------------------------------------------------------------------
// Get users with conversation but no messages
export async function getUsersWithConversationButNoMessages(forUserId: string) {
    const userConversations = await getUserConversations(forUserId)
    const userConversationsId = userConversations.map(conversation => conversation.id)

    return prisma.user.findMany({
        select: primaSafeSelectUser,
        where: {
            id: {
                not: forUserId
            },
            AND: {
                conversationUsers: {
                    some: {
                        conversation: {
                            messages: {
                                none: {}
                            }
                        }
                    }
                }
            }
        }
    })
}

// ------------------------------------------------------------------------------------------------
// Get user
export async function getUser(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: primaSafeSelectUser
    })
}

// ------------------------------------------------------------------------------------------------
// Get user by username
export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: { username },
        select: primaSafeSelectUser
    })
}

// ------------------------------------------------------------------------------------------------
// Get user password hash by username
export async function getUserPasswordHash(username: string) {
    return prisma.user.findUnique({
        where: { username },
        select: {
            password: true,
            id: true,
        }
    })
}

// ------------------------------------------------------------------------------------------------
// Add user
export async function addUser(user: UserCreateDTO) {
    return prisma.user.create({
        data: user,
        select: primaSafeSelectUser
    })
}

// ------------------------------------------------------------------------------------------------
// Update user
export async function updateUser(id: string, userData: UserUpdateDTO) {
    return prisma.user.update({
        where: { id },
        data: userData,
        select: primaSafeSelectUser
    })
}

// ------------------------------------------------------------------------------------------------
// Delete user
export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: { id },
        select: primaSafeSelectUser
    })
}