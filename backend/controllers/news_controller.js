import axios from "axios";
import { searchSimilarText } from "../services/searchText.js";
import { storeText } from "../services/storeText.js";
import { generateAnswer } from "../services/gemini.js";
import { redisClient } from "../services/redis.js";

import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "newsData.json");

export const getAllArticles = async (req, res) => {
  const { category } = req.params;

  let cachedData = {};
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    cachedData = JSON.parse(raw);
  }

  if (cachedData[category]) {
    return res.status(200).json({
      message: "Articles from cache",
      data: cachedData[category],
      success: true,
    });
  }

  // Fetch from API if not cached
  let article;
  if (category === "all") {
    const { data } = await axios.get(
      `https://newsapi.org/v2/everything?q=Apple&pageSize=80&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`
    );
    article = data.articles;
  } else {
    const { data } = await axios.get(
      `https://newsapi.org/v2/top-headlines/sources?category=${category}&apiKey=${process.env.NEWS_API_KEY}`
    );
    article = data.sources;
  }

  // Store in vector once
  for (let i = 0; i < article.length; i++) {
    if (article[i].title && article[i].description) {
      await storeText(
        article[i].title,
        article[i].description,
        article[i].source?.name || "",
        article[i].publishedAt || ""
      );
    }
  }

  // Save to file
  cachedData[category] = article;
  fs.writeFileSync(filePath, JSON.stringify(cachedData, null, 2), "utf-8");

  return res.status(200).json({
    message: "Articles fetched from API and stored in file",
    data: article,
    success: true,
  });
};


export const askAi = async (req, res) => {
  // await fetchNewsArticle()
  try {
    const { query } = req.body;
    const { session_id } = req.params;
    console.log(query);
    const respose = await searchSimilarText(query);
    const validContext = respose
      .filter((item) => item.description)
      .map((item) => `${item.title}: ${item.description}`)
      .join("\n\n");
  
    const aiRes = await generateAnswer(validContext, query);
    const newMessages = [
      { role: "user", message: query },
      { role: "bot", message: aiRes },
    ];
    await redisClient.rPush(`user:${session_id}`, JSON.stringify(newMessages));
  
    res
      .status(200)
      .json({ message: "Similar data foundr", success: true, data: aiRes });
  } catch (error) {
    console.log(error)
    res.status(505).json({message:"Internel server Error", success:false})
  }
};
