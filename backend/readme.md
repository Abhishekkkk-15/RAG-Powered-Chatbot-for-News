# 🧠 RAG-Powered Chatbot Backend (Express.js)

This is the backend for the RAG chatbot, handling embeddings, vector search, session storage, and interaction with Gemini.

---

## ⚙️ Tech Stack
- **Express.js (Node.js)**
- **Redis** for chat session history
- **Weaviate Cloud Vector DB** for storing and querying embeddings
- **@xenova/transformers(Hugging Face)** for generating embeddings
- **Google Gemini API** as LLM

---

## 📁 Folder Structure
```
📁 backend/
├── controllers/
├── data/
├── routes/
├── services/
│   ├── embedder.js
│   ├── weaviateClient.js
│   ├── redis.js
│   ├── gemini.js
│   ├── storeText.js
│   ├── searchText.js
├── index.js
└── .env
```

---

## 🛠 Setup Instructions

1. **Clone the repository**:
```bash
git clone <backend-repo-url>
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create a `.env` file**:
```env
PORT=5000
REDIS_URL=redis://default:<password>@<host>:<port>
GEMINI_API_KEY=<your_api_key>
WEAVIATE_URL=https://<your-instance>.weaviate.network
```

4. **Start the server**:
```bash
npm run dev
```

---

## 💬 Redis Sessions
- User chats stored under keys like `user:<session_id>`
- Each entry is a stringified JSON message (user & bot roles)
- Enables session-based memory with full context history

---

## 🔁 Workflow
1. Query received from frontend
2. Search vector DB for relevant article chunks
3. Gemini LLM generates answer using that context
4. Store both query and answer in Redis
5. Return result to user

---

## 🔐 Security Note
- Make sure to keep `.env` and secrets safe.
- Restrict CORS in production.
