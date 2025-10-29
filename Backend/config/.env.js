import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ARCJET_SECRET_KEY: process.env.ARCJET_SECRET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
  NODE_ENV: process.env.NODE_ENV,
};
