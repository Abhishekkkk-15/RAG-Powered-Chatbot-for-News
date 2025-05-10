import express from "express"
import { getAllArticles, askAi } from "../controllers/news_controller.js"
const router = express.Router()

router.get("/articles/:category", getAllArticles)
router.post("/articles/ask/:session_id", askAi)

export default router