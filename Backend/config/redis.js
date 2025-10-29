// redis.js
import { createClient } from "redis";
import { ENV } from "./.env.js";

export const redisClient = createClient({
  url: ENV.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("Redis Connection Success"))
  .catch((error) => console.log("Redis connection Failed", error));
