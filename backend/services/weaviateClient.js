import weaviate from "weaviate-ts-client"
import dotenv from 'dotenv';
dotenv.config();

export const client = weaviate.client({
  scheme: "https",
  host: process.env.WEAVIATE_CLOUD_API, // Ensure Weaviate is running
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
})