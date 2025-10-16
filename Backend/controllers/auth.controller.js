import { loginService, signupService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await signupService(fullName, email, password, res);

    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password, res);

    if (result.success) {
      return res.status(result.status).json(result.data);
    } else {
      return res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile=async(req,res)=>{
  try {
    
  } catch (error) {
        console.error("Error in update-profile controller:", error);
    return res.status(500).json({ message: "Something went wrong" });
    
  }
}