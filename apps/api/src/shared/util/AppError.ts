import type { ResponeType } from "../response/responeType.js";

export class AppError extends Error {
    public responseType: ResponeType;
    
    constructor(responseType: ResponeType, message?: string) {
        if (message && message.length > 0) {
            super(message)
        } else {
            super("")
        }
        this.responseType = responseType
    }
}