import User from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { responseHandler } from "../utils/responseHandler.util.js";
import { io, userMap } from "../server.js";

export const allContactService = async (user) => {
  try {
    const filteredUsers = await User.find({
      _id: { $ne: user },
    }).select("-password");

    return responseHandler(true, 200, {
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error in allcontactservice:", error);

    return responseHandler(false, 500, "Internal server error");
  }
};

export const MessagesByuserService = async (my, sender) => {
  try {
    const message = await Message.find({
      $or: [
        { senderId: my, receiverId: sender },
        { senderId: sender, receiverId: my },
      ],
    });
    return responseHandler(true, 200, {
      message,
    });
  } catch (error) {
    console.error("Error in allcontactservice:", error);

    return responseHandler(false, 500, "Internal server error");
  }
};

export const sendMessageService = async (userId, receiverId, text, image) => {
  try {
    if (image) {
      //save it to cloudinary
    }
    const newMessage = new Message({
      senderId: userId,
      receiverId: receiverId,
      text: text,
      image: "", //save the url of the image.
    });
    await newMessage.save();

    const receiverSockerId = userMap[receiverId];
    if (receiverSockerId) {
      io.to(receiverSockerId).emit("newMessages", newMessage);
      console.log(" Sent message to:", receiverId);
    } else {
      console.log(" Receiver is offline.");
    }

    return responseHandler(true, 200, {
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in send message service", error);
    return responseHandler(false, 500, "Internal server error");
  }
};

export const ChatService = async (user) => {
  try {
    const message = await Message.find({
      $or: [{ senderId: user }, { receiverId: user }],
    });

    const chatPartenerId = [
      ...new Set(
        message.map((msg) =>
          msg.senderId.toString() === user.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatParteners = await User.find({
      _id: { $in: chatPartenerId },
    }).select("-password");

    return responseHandler(true, 200, {
      chatParteners,
    });
  } catch (error) {
    console.log("Error in send message service", error);
    return responseHandler(false, 500, "Internal server error");
  }
};
