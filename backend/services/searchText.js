import {client} from './weaviateClient.js'
import {getEmbedding} from './embedder.js'

async function searchSimilarText(query) {
  try {
    console.log(query)
//     const schemaRes = await client.schema.getter().do();
// console.log(JSON.stringify(schemaRes, null, 2));
    const vector = await getEmbedding(query);
    const plainArray = Array.from(vector);
    const result = await client.graphql
      .get()
      .withClassName("Article")
      .withFields("title description _additional { distance }")
      .withNearVector({ vector:plainArray, certainty: 0.7 })
      .withLimit(3)
      .do();
  
    const matches = result.data.Get.Article;
    console.log("Search Results:",matches);
    
   return matches 
  } catch (error) {
    console.log(error.message)
  }
}

export { searchSimilarText };