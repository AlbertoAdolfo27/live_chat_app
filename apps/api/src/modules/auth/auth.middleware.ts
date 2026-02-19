import type { NextFunction, Request, Response } from "express";
import { verifyAppApiKey, verifyUserAccessToken } from "./auth.service.js";
import { makeResponseError } from "../../shared/response/response.js";

export async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        await verifyUserAccessToken(req)
        next()
    } catch (error: any) {
        next(makeResponseError(res, error))
    }
}

export async function authAppMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        await verifyAppApiKey(req)
        next();
    } catch (error: any) {
        next(makeResponseError(res, error))
    }
}
