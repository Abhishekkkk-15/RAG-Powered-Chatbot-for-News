import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
export const getAllArticles = async (category: string) => await axios.get(
    `/articles/${category}`
);

export const setUserSession = async () => await axios.get("/user/chat");

export const askAi = async (sessionId: string, message: string) => await axios.post(
    `/articles/ask/${sessionId}`,
    {
        query: message,
    }
);

export const refreshSession = async (sessionId: string) => await axios.delete(
    `/user/chat/delete/${sessionId}`
);

export const chatHistory = async (sessionId:string) => await axios.get(
    `/user/chat/history/${sessionId}`
);