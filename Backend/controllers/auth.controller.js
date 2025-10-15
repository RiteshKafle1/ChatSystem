import { signupService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log(req.body);

    const result = await signupService(fullName, email, password,res);

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.log("Error in registering user", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
