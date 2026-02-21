import { NextResponse, type NextRequest } from "next/server"
import authMiddleware from "./modules/auth/auth.middleware"

export async function proxy(request: NextRequest) {
    const resAuthMiddleware = await authMiddleware(request)
    if (resAuthMiddleware) return resAuthMiddleware

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Exclude API routes, static files, image optimizations, and .png files
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
}