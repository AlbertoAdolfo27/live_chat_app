import type { Request, Response } from "express"
import Router from "express"
import { makeResponse } from "../shared/response/response.js"
import { SUCCESS } from "../shared/response/responeType.js"
import userRouter from "../modules/users/user.routes.js"
import conversationRouter from "../modules/conversations/conversation.routes.js"
import messageRouter from "../modules/messages/message.routes.js"
import authRouter from "../modules/auth/auth.routes.js"
import { authAppMiddleware } from "../modules/auth/auth.middleware.js"

const router = Router();

router.use(authAppMiddleware)

// ------------------------------------------------------------------------------------------------
// Hellow World!
router.get('/', (req: Request, res: Response) => makeResponse(res, SUCCESS, "The API is running okay!"))

// ------------------------------------------------------------------------------------------------
// Users router
router.use(userRouter)

// ------------------------------------------------------------------------------------------------
// Conversations router
router.use(conversationRouter)

// ------------------------------------------------------------------------------------------------
// Messages router
router.use(messageRouter)

// ------------------------------------------------------------------------------------------------
// Get user acess token
router.use(authRouter)

export default router
