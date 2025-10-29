// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ENV } from "./config/.env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { generateDocs } from "./docs/generateDocs.js";
import { globalLimiter } from "./middlewares/ratelimit.js";
import swaggerUi from "swagger-ui-express";

export const app = express();
export const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const swaggerDoc = generateDocs(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ⚡ Socket.io
export const io = new Server(server, { cors: { origin: "*" } });
export const userMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userMap));

  socket.on("disconnect", () => {
    if (userId) delete userMap[userId];
    io.emit("getOnlineUsers", Object.keys(userMap));
  });
});

if (process.env.NODE_ENV !== "test") {
  const PORT = ENV.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📘 Swagger UI at http://localhost:${PORT}/api-docs`);
  });
}
