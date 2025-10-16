import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../config/.env.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorizes -No token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .status.json({ message: "Unauthorizes -No token provided" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).status.json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    return res.status(500).status.json({ message: "Internal server error" });
  }
};
