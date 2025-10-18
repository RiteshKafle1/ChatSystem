import { loginService, signupService } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../middlewares/auth.middleware.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await signupService(fullName, email, password, res);

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
      const decoded = jwt.decode(accessToken);
      await redisClient.del(`token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error logging out:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};
export const refreshToken = async (req, res) => {
  await refreshAccessToken(req, res);
};
