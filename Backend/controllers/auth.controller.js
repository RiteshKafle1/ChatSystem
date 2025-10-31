import { loginService, signupService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../middlewares/auth.middleware.js";
import { redisClient } from "../config/redis.js";
import { ENV } from "../config/.env.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await signupService(fullName, email, password, res);
    // console.log(result);

    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password, res);

    if (result.success) {
      res.cookie("accessToken", result.data.accessToken, {
        maxAge: 15 * 60 * 100,
        httpOnly: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", result.data.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      });
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, ENV.JWT_ACCESS_SECRET);

        await redisClient.del(`access:${decoded.userId}`);
        await redisClient.del(`refresh:${decoded.userId}`);
      } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(500).json({ message: "Logout failed" });
      }
    }

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const refreshToken = async (req, res) => {
  await refreshAccessToken(req, res);
};

export const updateProfile = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in update Profile function", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
