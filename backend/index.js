import express from "express";
import newRouter from "./routes/news_route.js";
import bodyParser from "body-parser";
import fetchNewsArticle from "./services/fetchNews.js";
import cors from "cors";
import axios from "axios";
const app = express();
app.use(
  cors({
    // origin: 'https://fun-blogging-app.vercel.app', // Adjust this to your frontend URL
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/get", async (req, res) => {
  const { data } = await axios.get(
    "https://newsapi.org/v2/everything?q=Apple&pageSize=100&sortBy=popularity&apiKey=cc9b0bd513984fcdb6c66bcbccc27fe7"
  );
  console.log(data.articles.length)
  res.send(data)
});
// If using body-parser (optional)
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/api", newRouter);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
