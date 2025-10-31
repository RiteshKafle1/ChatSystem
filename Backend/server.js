import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ENV } from "./config/.env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./config/db.js";

import { globalLimiter } from "./middlewares/ratelimit.js";

export const app = express();
export const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Socket.io
export const io = new Server(server, { cors: { origin: "*" } });
export const userMap = {};

io.on("connection", (socket) => {
  // socket.on("sendMessage", (data) => {
  //   console.log(data);
  //   console.log("Got message from client:", data.text);
  // });

  const userId = socket.handshake.query.userId; //client is sending us the userId
  console.log(" User Connected:", userId);

  if (userId) userMap[userId] = socket.id;

  console.log("Socket id", socket.id);

  console.log("User Map", userMap);
  console.log("Object.keys method", Object.keys(userMap)); //basically all the connected user with their userId are now stored in the array.

  io.emit("getOnlineUsers", Object.keys(userMap));

  socket.on("disconnect", () => {
    if (userId) delete userMap[userId];
    io.emit("getOnlineUsers", Object.keys(userMap));

    console.log(" User disconnected:", userId);
  });
});

if (process.env.NODE_ENV !== "test") {
  const PORT = ENV.PORT || 2500;
  server.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
