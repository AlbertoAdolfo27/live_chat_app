import { Router } from "express"
import { getUser, getUsers, updateUser, deleteUser, registerUser } from "./user.controller.js"
import { authUserMiddleware } from "../auth/auth.middleware.js"

const router = Router()
// Get users
router.get("/users", authUserMiddleware, getUsers)

// Register user
router.post("/users", registerUser)

// Get user
router.get("/users/:id", authUserMiddleware, getUser)

// Update user
router.put("/users/me", authUserMiddleware, updateUser)

// Delete user
router.delete("/users/me", authUserMiddleware, deleteUser)

export default router
