import express from "express";
import {
  getAllContacts,
  getMessagesByuserId,
  sendMessage,
} from "../controllers/message.controller.js";

import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { arcjetProtect } from "../middlewares/arcjet.middleware.js";
const router = express.Router();

router.get("/contacts", arcjetProtect, verifyAccessToken, getAllContacts);

router.get("/:id", arcjetProtect, verifyAccessToken, getMessagesByuserId);

router.post("/send/:id", arcjetProtect, verifyAccessToken, sendMessage);

export default router;
