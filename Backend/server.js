import express from "express";
import { ENV } from "./config/.env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

import { swaggerDocs } from "./config/swagger.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

swaggerDocs(app);
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running", PORT);
});
