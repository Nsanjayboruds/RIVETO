import User from "../model/userModel.js";
import logger from "../config/logger.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error("getCurrentUser error", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const adminEmail = req.adminEmail;

    if (!adminEmail) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No admin email found" });
    }

    return res.status(200).json({
      email: adminEmail,
      role: "admin",
    });
  } catch (error) {
    logger.error("getAdmin error", { error: error.message });
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
