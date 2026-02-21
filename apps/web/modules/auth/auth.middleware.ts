import { checkUserAuthentication } from "./auth.service"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login", "/register"] as const

export default async function authMiddleware(request: NextRequest) {
    const currentPatch = request.nextUrl.pathname

    const isAuthenticated = await checkUserAuthentication()

    const publicRoute = PUBLIC_ROUTES.find((route) => route === currentPatch)
    if (publicRoute) {
        if (isAuthenticated) return NextResponse.redirect(new URL("/", request.url))
        return null
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
    return null
}