import axios from "axios";
import { storeText } from "./storeText.js";

const fetchNewsArticle = async () => {
    const news = await axios.get(
      `https://newsdata.io/api/1/latest?apikey=pub_8533773bc80749104658b427580dab387c583&size=10&language=en&country=au,us`
    );
  
    let articles = news.data?.results;
    let len = articles?.length || 0;
  
    if (!articles || len === 0) { 
      console.log("No articles found");
      return;
    }
  
    for (let index = 0; index < len; index++) {
      const articleText = `${articles[index]?.title || ""} - ${articles[index]?.description || ""}`;
      // await storeText(articleText);
      console.log(articleText)
      await storeText(articles[index]?.title, articles[index]?.description, articles[index]?.source_id);
    }
    
  
    console.log("\n✅ Articles stored! You can now search for any topic.");
    return articles
  }

  export default fetchNewsArticle