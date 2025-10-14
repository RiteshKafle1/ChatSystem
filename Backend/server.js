import express from "express";
import { ENV } from "./config/.env.js";
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.route.js'


const app = express();
const PORT = ENV.PORT || 3000;


app.use('/api/v1/auth',authRoutes)

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running", PORT);
});
