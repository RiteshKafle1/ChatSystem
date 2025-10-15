import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/user.model.js";
import { generateToken } from "../utils/utils.js";

export const signupService = async (fullName, email, password,res) => {
  
  if (!fullName || !email || !password) {
    return { status: 400, message: "All fields are required" };
  }

  if (!validator.isEmail(email)) {
    return { status: 400, message: "Please enter a valid email" };
  }

  if (!validator.isStrongPassword(password)) {
    return { status: 400, message: "Password too weak" };
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return { status: 400, message: "Email already exists" };
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
  return {
    status: 201,
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    },
  };
};
