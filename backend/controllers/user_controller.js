import { redisClient } from "../services/redis.js";
import { v4 as uuidv4 } from "uuid";

export const generateSession = async (req, res) => {
  try {
    console.log("its comming here")
    const sessionId = uuidv4();
    res.status(200).json({ message:"Session Generated", success:true ,data:sessionId });
  } catch (error) {
    console.log(error)
  }
};

export const getUserChatHistory = async (req, res) => {
  const { session_id } = req.params;
  console.log(session_id)
  const oldChat = await redisClient.lRange(`user:${session_id}`,0, -1);
  if (oldChat.length == 0) {
    return res
      .status(404)
      .json({ message: "No chat found for this user", success: false });
  }
  const parsedChat = oldChat.map(item => {
    try {
      return JSON.parse(item);
    } catch (err) {
      console.warn("Could not parse item:", item);
      return item; // fallback to raw string if it's not valid JSON
    }
  });
  res.status(200).json({ message: "Chat found", data: parsedChat, success: true });
};
