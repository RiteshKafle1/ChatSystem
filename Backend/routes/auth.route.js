import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { arcjetProtect } from "../middlewares/arcjet.middleware.js";
import { signupLimiter, loginLimiter } from "../middlewares/ratelimit.js";

const router = express.Router();

router.post("/signup", arcjetProtect,signup);

router.post("/login", arcjetProtect,  login);

router.post("/logout", arcjetProtect, logout);

router.post("/update-profile", arcjetProtect, verifyAccessToken, updateProfile);

router.post("/refresh", refreshToken);

export default router;
