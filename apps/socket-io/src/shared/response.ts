type Status = "success" | "error"

export const RESPONSE_SUCCESS_MESSAGE = "The request has been succesfully proccessed"
export const RESPONSE_ERROR_MESSAGE = "An error occured while procesing the request"

export function makeResponse(status: Status, message?: string, data?: any) {
    let response

    if (!message) {
        if (status === "success") {
            message = RESPONSE_SUCCESS_MESSAGE
        } else {
            message = RESPONSE_ERROR_MESSAGE
        }
    }

    if (status === "success") {
        response = (data) ? { status, message, data } : { status, message }
    } else {
        response = (data) ? { status, error: message, data } : { status, error: message }
    }

    return response
}

export function responseCallback(callback: any, status: Status, message?: string, data?: any) {
    if (typeof callback !== "function") return

    callback(makeResponse(status, message, data))
}