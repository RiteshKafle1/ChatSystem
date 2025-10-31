import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //Each IP is allowed 1000 requests every 15 minutes.
  max: 1000,
  message: "Too many requests,please try again later",
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: "Too many login attempts, please try again after 10 minutes.",
});

// 🧾 Signup limiter
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many signup attempts, please try again after an hour.",
});
