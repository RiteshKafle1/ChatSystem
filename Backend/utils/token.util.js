import jwt from "jsonwebtoken";
import { ENV } from "../config/.env.js";
import { redisClient } from "../config/redis.js";

export const generateToken = async (userId, res) => {
  const accessToken = jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await redisClient.set(`token:${userId}`, accessToken, { EX: 60 * 15 });

  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 100,
    httpOnly: true,
    sameSite: "strict",
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });
  return { accessToken, refreshToken };
};
