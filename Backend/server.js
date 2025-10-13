import express from "express";
import { ENV } from "./config/.env.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running", PORT);
});
