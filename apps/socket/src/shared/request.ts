import "dotenv/config"
import { API_BASE_URL } from "./config.js";

type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

export async function request(urlPath: string, method: Method, userAccessToken: string, data?: any) {
    if (!data) {
        data = ""
    }

    if (typeof data != "string") {
        data = JSON.stringify(data)
    }

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userAccessToken}`,
            "X-API-KEY": `${process.env.API_KEY}`,
        }
    }

    if (method !== "GET" && data) {
        //@ts-ignore
        options.body = data
    }

    const response = await fetch(`${API_BASE_URL}${urlPath}`, options)

    const responseData = await response.json();
    if (responseData.status === "error") {
        throw new Error(responseData.error)
    }

    return responseData
}