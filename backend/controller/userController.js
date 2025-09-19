import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("getCurrentUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAdmin = async (req, res) => {
  try {
    const adminEmail = req.adminEmail;

    if (!adminEmail) {
      return res.status(401).json({ message: "Unauthorized: No admin email found" });
    }

    return res.status(200).json({
      email: adminEmail,
      role: "admin"
    });
  } catch (error) {
    console.error("getAdmin error:", error);
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
