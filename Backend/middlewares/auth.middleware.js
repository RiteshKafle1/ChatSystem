import jwt from "jsonwebtoken";

import { ENV } from "../config/.env.js";
import { redisClient } from "../config/redis.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorizes -No token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .status.json({ message: "Unauthorizes -No token provided" });
    }

    const redisToken = await redisClient.get(`access:${decoded.userId}`);

    if (!redisToken || redisToken != token) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    return res.status(500).status.json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(oldRefreshToken, ENV.JWT_REFRESH_SECRET);

    const storedToken = await redisClient.get(`refresh:${decoded.userId}`);

    if (storedToken !== oldRefreshToken) {
      return res
        .status(403)
        .json({ message: "Invalid or reused refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await redisClient.del(`access:${decoded.userId}`);
    await redisClient.del(`refresh:${decoded.userId}`);

    await redisClient.set(`token:${decoded.userId}`, newAccessToken, {
      EX: 60 * 15,
    });
    
    await redisClient.set(`refresh:${decoded.userId}`, newRefreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Tokens rotated successfully" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
