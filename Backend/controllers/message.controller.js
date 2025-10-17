import {
  allContactService,
  ChatService,
  MessagesByuserService,
  sendMessageService,
} from "../services/message.service.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
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
    const loggedInUser = req.user._id; //myId
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
    const { text, image } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    const result = await sendMessageService(userId, id, text, image);
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

export const getChats = async (req, res) => {
  try {
        const loggedInUser = req.user._id; //myId

        await ChatService(loggedInUser)


  } catch (error) {
    console.error("Error in getChats controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
