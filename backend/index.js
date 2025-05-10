import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import newRouter from "./routes/news_route.js";
import userRouter from "./routes/user_route.js";
import { initRedis } from "./services/redis.js";
const app = express();
app.use(
  cors({
    origin: "https://newsai-flax.vercel.app/",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({  extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
initRedis()

app.use("/api", newRouter);
app.use("/api", userRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
