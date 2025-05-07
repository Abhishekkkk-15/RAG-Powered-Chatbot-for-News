// backend/services/embedder.js
import { env as nodeEnv } from 'node:process';
import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';

dotenv.config();

let embedder;  // Will store the feature extraction model

async function loadModel() {
  if (!embedder) {
    // Load the 'Xenova/all-MiniLM-L6-v2' model for feature extraction
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
}

export async function getEmbedding(text) {
  await loadModel();  // Ensure the model is loaded first
  const result = await embedder(text, { pooling: 'mean', normalize: true });  // Generate embeddings
 
  return result.data;  // Return the embeddings array
}
