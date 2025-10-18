import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.util.js";
import { responseHandler } from "../utils/responseHandler.util.js";
import { redisClient } from "../config/redis.js";

export const signupService = async (fullName, email, password, res) => {
  try {
    if (!fullName || !email || !password) {
      return responseHandler(false, 400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
      return responseHandler(false, 400, "Please enter a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      return responseHandler(false, 400, "Password too weak");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return responseHandler(false, 400, "Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      password: hashedPass,
    });

    await user.save();
    const token = generateToken(user._id, res);

    return responseHandler(true, 201, {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.error("Error in signupService:", error);

    return responseHandler(false, 500, "Internal server error");
  }
};

export const loginService = async (email, password, res) => {
  try {
    if (!email || !password) {
      return responseHandler(false, 400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
      return responseHandler(false, 400, "Please enter a valid email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return responseHandler(false, 400, "Email already exists");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return responseHandler(false, 400, "Invalid credentials");
    }
    const token = generateToken(user._id, res);

    await redisClient.setEx(`token:${user._id}`,3600,token);

    return responseHandler(true, 200, {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.error("Error in loginService:", error);

    return responseHandler(false, 500, "Internal server error");
  }
};
