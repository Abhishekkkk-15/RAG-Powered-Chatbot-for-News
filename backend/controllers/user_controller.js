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
  console.log("its getting called",session_id)
  console.log(session_id)
  const oldChat = await redisClient.lRange(`user:${session_id}`,0, -1);
  if (oldChat.length == 0) {
    return res
      .status(404)
      .json({ message: "No chat found for this user", success: false });
  }
  console.log(oldChat)
  const parsedChat = oldChat.map(item => {
    try {
      return JSON.parse(item);
    } catch (err) {
      console.warn("Could not parse item:", item);
      return item; // fallback to raw string if it's not valid JSON
    }
  });
  console.log(parsedChat)
  res.status(200).json({ message: "Chat found", data: parsedChat, success: true });
};

export const deleteUserChats = async (req, res) => {
  const { session_id } = req.params;

  if (!session_id) {
    return res.status(400).json({ message: "Session ID is required", success: false });
  }

  try {
    const key = `user:${session_id}`;
    const result = await redisClient.del(key);

    if (result === 0) {
      return res.status(404).json({ message: "No chat found to delete", success: false });
    }

    res.status(200).json({ message: "Chat history deleted", success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
