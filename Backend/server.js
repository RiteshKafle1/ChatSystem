import express from "express";
import { ENV } from "./config/.env.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => console.log("Server is running", PORT));
