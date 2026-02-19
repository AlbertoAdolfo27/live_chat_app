import * as httpCode from "./httpCode.js";

export type ResponeType = {
    responseCode: string,
    statusCode: number,
    message: string,
    type: "success" | "error"
}

export const SUCCESS: ResponeType = {
    responseCode: "rc-001",
    statusCode: httpCode.SUCCESS,
    message: "The request has been succesfully proccessed",
    type: "success"
}

export const CREATED: ResponeType = {
    responseCode: "rc-002",
    statusCode: httpCode.CREATED,
    message: "The request has been succesfully proccessed",
    type: "success"
}

export const BAD_REQUEST: ResponeType = {
    responseCode: "rc-003",
    statusCode: httpCode.BAD_REQUEST,
    message: "Bad request",
    type: "error"
}

export const UNAUTHORIZED: ResponeType = {
    responseCode: "rc-004",
    statusCode: httpCode.UNAUTHORIZED,
    message: "Unauthorized access",
    type: "error"
}

export const NOT_FOUND: ResponeType = {
    responseCode: "rc-004",
    statusCode: httpCode.NOT_FOUND,
    message: "Resourse not found",
    type: "error"
}

export const METHOD_NOT_ALLOWED: ResponeType = {
    responseCode: "rc-005",
    statusCode: httpCode.METHOD_NOT_ALLOWED,
    message: "Method not allowed",
    type: "error"
}
export const REQUEST_TIMEOUT: ResponeType = {
    responseCode: "rc-006",
    statusCode: httpCode.REQUEST_TIMEOUT,
    message: "Request timeout",
    type: "error"
}

export const CONFLICT: ResponeType = {
    responseCode: "rc-007",
    statusCode: httpCode.CONFLICT,
    message: "Conflict",
    type: "error"
}

export const INTERNAL_ERROR: ResponeType = {
    responseCode: "rc-008",
    statusCode: httpCode.INTERNAL_ERROR,
    message: "An error occurred while processing the request",
    type: "error"
}

export const FORBIDDEN: ResponeType = {
    responseCode: "rc-009",
    statusCode: httpCode.INTERNAL_ERROR,
    message: "Resource fordidden",
    type: "error"
}

export const UNAUTHORIZED_APP: ResponeType = {
    responseCode: "rc-010",
    statusCode: httpCode.UNAUTHORIZED,
    message: "Unauthorized app access",
    type: "error"
}

