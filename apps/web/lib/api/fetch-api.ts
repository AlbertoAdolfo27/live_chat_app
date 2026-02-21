import { API_BASE_URL } from "@/config/config"

type Method = "POST" | "GET" | "PUT" | "PACTH"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchApi(endpoit: string, method: Method, userAccessToken: string, data?: any) {
    let headers
    if (userAccessToken) {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userAccessToken}`,
            "X-API-KEY": `${process.env.API_KEY}`,
        }
    } else {
        headers = {
            "Content-Type": "application/json",
            "X-API-KEY": `${process.env.API_KEY}`,
        }
    }

    let options
    if (method !== "GET" && data) {
        if (typeof data != "string") {
            data = JSON.stringify(data)
        }

        options = {
            method: method,
            headers: headers,
            body: data
        }
    }
    else {
        options = {
            method: method,
            headers: headers,
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoit}`, options)

    const responseData = await response.json();
    if (responseData.status === "error") throw new Error(responseData.error)

    return responseData
}