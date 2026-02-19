import type { Request, Response } from "express"
import { makeResponse, makeResponseError } from "../../shared/response/response.js"
import { SUCCESS, BAD_REQUEST, CREATED, NOT_FOUND, INTERNAL_ERROR } from "../../shared/response/responeType.js"
import * as userService from "./user.service.js"
import { AppError } from "../../shared/util/AppError.js"
import { verifyUserAccessToken } from "../auth/auth.service.js"


// ------------------------------------------------------------------------------------------------
// Get users
export async function getUsers(req: Request, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const filter = req.query.filter as string || ""

        const users = await userService.getUsers(userId, filter)

        makeResponse(res, SUCCESS, SUCCESS.message, { users })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Get user
export async function getUser(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params

        const user = await userService.getUser(id)

        if (!user) throw new AppError(NOT_FOUND, "User not found")
        makeResponse(res, SUCCESS, SUCCESS.message, { user })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Register user
export async function registerUser(req: Request, res: Response) {
    try {
        const { name, username, password, email } = req.body

        if (!name) throw new AppError(BAD_REQUEST, "Missing name")
        if (!email) throw new AppError(BAD_REQUEST, "Missing email")
        if (!username) throw new AppError(BAD_REQUEST, "Missing username")
        if (!password) throw new AppError(BAD_REQUEST, "Missing password")

        const user = await userService.registerUser({ name, password, email, username })
        makeResponse(res, CREATED, "The User as been successfully registered", { user })

    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Update user
export async function updateUser(req: Request, res: Response
) {
    try {
        const { userId } = await verifyUserAccessToken(req)
        const { name, password, email, username } = req.body

        if (!name) throw new AppError(BAD_REQUEST, "Missing name")
        if (!password) throw new AppError(BAD_REQUEST, "Missing password")
        if (!username) throw new AppError(BAD_REQUEST, "Missing username")
        if (!email) throw new AppError(BAD_REQUEST, "Missing email")

        const user = await userService.updateUser(userId, { name, password, email, username })
        makeResponse(res, SUCCESS, "The user has been successfully updated", { user })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// ------------------------------------------------------------------------------------------------
// Delete user
export async function deleteUser(req: Request, res: Response) {
    try {
        const { userId } = await verifyUserAccessToken(req)

        await userService.deleteUser(userId)
        makeResponse(res, SUCCESS, "The user has been successfully deleted")

    } catch (error: any) {
        makeResponseError(res, error)
    }
}

