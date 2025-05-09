import { client } from './weaviateClient.js';
import { getEmbedding } from './embedder.js';

async function searchSimilarText(query) {
  try {
    console.log("Query:", query);

    const vector = await getEmbedding(query);
    const plainArray = Array.from(vector);

    const result = await client.graphql
      .get()
      .withClassName("Article")
      .withFields(`
        title 
        description 
        _additional { distance }
      `)
      .withHybrid({ query: query, vector: plainArray, alpha: 0.6 })
      .withLimit(10)
      .do();

    const matches = result.data.Get.Article;
    return matches;
  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}

export { searchSimilarText };
