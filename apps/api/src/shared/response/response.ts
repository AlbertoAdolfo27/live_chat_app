import { INTERNAL_ERROR, type ResponeType } from "./responeType.js"
import type { Response as ExpressResponse } from "express"
import { AppError } from "../util/AppError.js"


type Response = {
    status: string
    responseCode: string;
    message?: string;
    data?: object
    error?: string
}

// ------------------------------------------------------------------------------------------------
// Response
export function makeResponse(res: ExpressResponse, responeType: ResponeType, message?: string, data?: object) {

    const response: Response = {
        status: responeType.type,
        responseCode: responeType.responseCode,
    }

    if (responeType.type === "success") {
        const successMessage = (message && message.length > 0) ? message : responeType.message
        response.message = successMessage
        if (data) response.data = data
    } else {
        const errorMessage = (message && message.length > 0) ? message : responeType.message
        response.error = errorMessage
    }

    res.status(responeType.statusCode).json(response)
}

// ------------------------------------------------------------------------------------------------
// Response Error
export function makeResponseError(res: ExpressResponse, error: Error | AppError) {
    if (error instanceof AppError) {
        makeResponse(res, error.responseType, error.message)
    } else {
        makeResponse(res, INTERNAL_ERROR, error.message)
    }
}