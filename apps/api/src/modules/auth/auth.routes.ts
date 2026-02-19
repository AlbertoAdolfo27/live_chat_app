import { Router } from "express"
import { getUserAccessToken, verifyUserAccessToken } from "./auth.controller.js"

const router = Router()

// Post user acess token
router.post("/auth/access-token", getUserAccessToken)

// Verify token
router.get("/auth/verify", verifyUserAccessToken)


export default router