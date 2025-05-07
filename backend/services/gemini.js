// backend/services/gemini.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const apikey = process.env.GEMINI_API_KEY;

export async function generateAnswer(context, question) {
  const prompt = `
  You are a helpful AI assistant. Use the following news context to answer the question below.
  
  Context:
  ${context || "No context provided"}
  
  Question:
  ${question}
  
  Instructions:
  - If the context contains relevant information, base your answer strictly on it.
  - If no context is provided or it's insufficient, use your own general knowledge to answer as best as possible.
  - Be clear and concise in your response.
  `;
  

  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apikey}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  return res.data.candidates[0].content.parts[0].text;
}
