import express from "express"
import { generateSession, getUserChatHistory } from "../controllers/user_controller.js"
const router = express.Router()

router.get("/user/chat", generateSession)
router.get("/user/chat/history/:session_id",getUserChatHistory)

export default router