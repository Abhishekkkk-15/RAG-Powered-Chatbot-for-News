import express from "express"
import { getAllAricles, getArticle, askAi, storeEmbeddingText } from "../controllers/news_controller.js"
const router = express.Router()

router.get("/articles/:category", getAllAricles)
router.get("/article/:id", getArticle)
router.post("/new_query", storeEmbeddingText)
router.post("/ask", askAi)

export default router