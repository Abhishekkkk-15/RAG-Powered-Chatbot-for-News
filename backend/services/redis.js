import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
    keepAlive: 30,
    reconnectStrategy: function (retries) {
      return Math.min(retries * 200, 5000);
    },
  },
  pingInterval: 10000,
});

const initRedis = async function () {
  redisClient.on("error", function (err) {
    console.log("❌ Redis Error:", err);
  });

  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis!");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }

  redisClient.on("end", async function () {
    console.log("⚠️ Redis connection lost. Checking connection...");
    try {
      await redisClient.ping();
    } catch (error) {
      console.log("🔄 Reconnecting to Redis...");
      await redisClient.connect();
    }
  });
};

export { redisClient, initRedis };
