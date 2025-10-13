import "dotenv/config";

export const ENV={
  PORT:process.env.PORT||4000,
  MONGO_URI:process.env.MONGO_URI
}
