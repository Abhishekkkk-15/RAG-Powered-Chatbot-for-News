import axios from "axios";
import fetchNewsArticle from "../services/fetchNews.js";
import { searchSimilarText } from "../services/searchText.js";
import { storeText } from "../services/storeText.js";
import { generateAnswer } from "../services/gemini.js";
import { redisClient } from "../services/redis.js";

export const getAllAricles = async (req, res) => {
  let article;
  const { category } = req.params;
  console.log(category);
  if (category == "all") {
    const { data } = await axios.get(
      `https://newsapi.org/v2/everything?q=Apple&pageSize=80&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`
    );
    console.log(data.articles);
    article = data.articles;
  } else {
    const { data } = await axios.get(
      `https://newsapi.org/v2/top-headlines/sources?category=${category}&apiKey=${process.env.NEWS_API_KEY}`
    );
    console.log(data.articles.length);
    article = data.articles;
  }

  for (let index = 0; index <= article.length - 1; index++) {
    if (article[index].title && article[index].description) {
      await storeText(
        article[index].title,
        article[index].description,
        article[index].source.name,
        article[index].publishedAt
      );
    }
  }

  // console.log("All ",data)
  res
    .status(200)
    .json({ message: "All Articles", data: article, success: true });
};

export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const article = await axios.get(
      `https://newsdata.io/api/1/latest?apikey=pub_8533773bc80749104658b427580dab387c583&id=${id}`
    );
    //   console.log(article)
    res.status(200).json({
      message: "Article Found",
      success: true,
      data: article.data.results[0],
    });
  } catch (error) {
    res.status(505).json({ message: "Server error" });
  }
};

export const storeEmbeddingText = async (req, res) => {
  const { title, descripiton } = req.body;
  if (!title || !descripiton) {
    return res
      .status(404)
      .json({ message: "Data not provided", success: false });
  }
  await storeText(title, descripiton, "sdfa");
  res.status(200).json({ message: "Added to vactor", success: true });
};

export const askAi = async (req, res) => {
  // await fetchNewsArticle()
  const { query } = req.body;
  const { session_id } = req.params;
  console.log(query);
  const respose = await searchSimilarText(query);
  const validContext = respose
    .filter((item) => item.description) // Only include items where description is present
    .map(
      (item) =>
        `${item.title}: ${item.description}`
    ) // Combine title and description into a single string
    .join("\n\n"); // Join the items with a double newline

  const aiRes = await generateAnswer(validContext, query);
  const newMessages = [
    { role: "user", message: query },
    { role: "bot", message: aiRes },
  ];
  await redisClient.rPush(
    `user:${session_id}`,
    ...newMessages.map((n) => JSON.stringify(n))
  );

  res
    .status(200)
    .json({ message: "Similar data foundr", success: true, data: aiRes });
};
