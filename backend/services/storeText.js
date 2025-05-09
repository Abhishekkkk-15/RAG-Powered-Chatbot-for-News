// storeText.js
import {client} from './weaviateClient.js'
import {getEmbedding} from './embedder.js'
import { v4 as uuidv4 } from 'uuid';

export async function storeText(title = "", description = "", source = "") {
  const fullText = `${title} - ${description}`.trim();
  if (!fullText) {
    console.log("⚠️ No data to store.");
    return;
  }

  const vector = await getEmbedding(fullText);
  const plainArray = Array.from(vector);

  await client.data
    .creator()
    .withClassName("Article")
    .withId(uuidv4())
    .withProperties({
      title,
      description,
      source,
    })
    .withVector(plainArray)
    .do();

  console.log("✅ Stored in store :", title || "[Untitled]");
}

