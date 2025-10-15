import validator from "validator";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    //validation for the fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password too weak" });
    }

    //checking if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    // hashing the password through bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    //creation of new user
    const user = new User({
      fullName:fullName,
      email,
      password: hashedPass,
    });

    if (user) {
     const token= generateToken(user._id, res);
      await user.save();
      return res.status(201).json({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token:token
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in registering user", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
