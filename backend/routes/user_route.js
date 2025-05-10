import express from "express"
import { deleteUserChats, generateSession, getUserChatHistory } from "../controllers/user_controller.js"
const router = express.Router()

router.get("/user/chat", generateSession)
router.get("/user/chat/history/:session_id",getUserChatHistory)
router.delete("/user/chat/delete/:session_id", deleteUserChats)

export default router