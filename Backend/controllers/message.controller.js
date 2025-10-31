import {
  allContactService,
  MessagesByuserService,
  sendMessageService,
} from "../services/message.service.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user.userId;

    const result = await allContactService(loggedInUser);
    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in getAllContacts controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMessagesByuserId = async (req, res) => {
  try {
    const loggedInUser = req.user.userId; //myId
    const { id } = req.params; //senderId

    const result = await MessagesByuserService(loggedInUser, id);
    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in getMessagesByuserId controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await sendMessageService(userId, id, text);
    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in getMessagesByuserId controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
