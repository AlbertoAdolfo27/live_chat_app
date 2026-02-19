import { AppError } from "../../shared/util/AppError.js"
import * as responseType from "../../shared/response/responeType.js"
import * as UserRepository from "./user.repository.js"
import type { UserSafeResponseDTO } from "./dto/user-response.dto.js"
import type { UserCreateDTO } from "./dto/user-create.dto.js"
import type { UserUpdateDTO } from "./dto/user-update-dto.js"
import { verify, hash } from "argon2"

const GET_USERS_FILTER = {
    withoutConversation: "without-conversation",
    withoutMessages: "without-messages"
}
// ------------------------------------------------------------------------------------------------
// Get users
export async function getUsers(userId: string | null = null, filter: string = ""): Promise<UserSafeResponseDTO[]> {
    switch (filter) {
        case GET_USERS_FILTER.withoutConversation:
            if (!userId) throw new AppError(responseType.INTERNAL_ERROR, "Missing user id")
            return UserRepository.getUsersWithoutConversation(userId)

        case GET_USERS_FILTER.withoutMessages:
            if (!userId) throw new AppError(responseType.INTERNAL_ERROR, "Missing user id")
            return UserRepository.getUsersWithConversationButNoMessages(userId)

        default:
            return UserRepository.getUsers()
    }
}

// ------------------------------------------------------------------------------------------------
// Get user
export async function getUser(id: string): Promise<UserSafeResponseDTO | null> {
    return UserRepository.getUser(id)
}

// ------------------------------------------------------------------------------------------------
// Get user by username
export async function getUserByUsername(username: string): Promise<UserSafeResponseDTO | null> {
    return UserRepository.getUserByUsername(username)
}

// ------------------------------------------------------------------------------------------------
// Add user
export async function registerUser(user: UserCreateDTO): Promise<UserSafeResponseDTO> {
    const resUser = await getUserByUsername(user.username)
    if (resUser) throw new AppError(responseType.CONFLICT, "The username is not available")

    const passwordHash = await hash(user.password)
    user.password = passwordHash

    return UserRepository.addUser(user)
}

// ------------------------------------------------------------------------------------------------
// Update user
export async function updateUser(id: string, userData: UserUpdateDTO): Promise<UserSafeResponseDTO> {
    const resUser = await getUser(id)
    if (!resUser) throw new AppError(responseType.NOT_FOUND, "User not found")

    const passwordHash = await hash(userData.password)
    userData.password = passwordHash

    return UserRepository.updateUser(id, userData)
}

// ------------------------------------------------------------------------------------------------
// Delete user
export async function deleteUser(id: string): Promise<UserSafeResponseDTO> {
    const resUser = await getUser(id)
    if (!resUser) throw new AppError(responseType.NOT_FOUND, "User not found")

    return UserRepository.deleteUser(id)
}
