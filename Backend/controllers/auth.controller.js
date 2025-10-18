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

export const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(400).json({ message: "No token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Delete token from Redis
    await redisClient.del(`token:${decoded.userId}`);

    res.clearCookie("token", {
      httpOnly: true,

      sameSite: "strict",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout functionality", error);
    return res.status(500).json({ message: "Error logging out" });
  }
};
