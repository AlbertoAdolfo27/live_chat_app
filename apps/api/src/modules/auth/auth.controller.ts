import { SignJWT } from "jose";
import { BAD_REQUEST, SUCCESS, UNAUTHORIZED } from "../../shared/response/responeType.js";
import { AppError } from "../../shared/util/AppError.js";
import { getUserPasswordHash } from "../users/user.repository.js";
import type { NextFunction, Request, Response } from "express";
import { makeResponse, makeResponseError } from "../../shared/response/response.js";
import * as authService from "./auth.service.js"

// Get jwt access token
export async function getUserAccessToken(req: Request, res: Response) {
    try {
        const { username, password } = req.body

        if (!username) throw new AppError(BAD_REQUEST, "Missing username")
        if (!password) throw new AppError(BAD_REQUEST, "Missing password")

        const accessToken = await authService.getUserAccessToken(username, password)

        makeResponse(res, SUCCESS, SUCCESS.message, { accessToken })
    } catch (error: any) {
        makeResponseError(res, error)
    }
}

// Verify access token
export async function verifyUserAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = await authService.verifyUserAccessToken(req);
        makeResponse(res, SUCCESS, SUCCESS.message, { userId })
    } catch (error: any) {
        makeResponseError(res, error)
    }

}