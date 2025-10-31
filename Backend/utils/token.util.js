import jwt from "jsonwebtoken";
import { ENV } from "../config/.env.js";
import { redisClient } from "../config/redis.js";

export const generateToken = async (userId) => {
  const accessToken = jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await redisClient.set(`access:${userId}`, accessToken, { EX: 15 * 60 });
  await redisClient.set(`refresh:${userId}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });

  return { accessToken, refreshToken };
};
