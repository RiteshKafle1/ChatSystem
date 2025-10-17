import express from "express";
import {
  getAllContacts,
  getMessagesByuserId,
  sendMessage,
  getChats
} from "../controllers/message.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { arcjetProtect } from "../middlewares/arcjet.middleware.js";
const router = express.Router();

router.get("/contacts", arcjetProtect, authUser, getAllContacts);
router.get("/chats",arcjetProtect, authUser,getChats);
router.get("/:id", arcjetProtect, authUser, getMessagesByuserId);
router.post("/send/:id", arcjetProtect, authUser, sendMessage);

export default router;
