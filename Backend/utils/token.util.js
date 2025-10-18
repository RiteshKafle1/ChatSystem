import jwt from "jsonwebtoken";
import { ENV } from "../config/.env.js";

export const generateToken = (userId, res) => {
  const accessToken = jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

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
