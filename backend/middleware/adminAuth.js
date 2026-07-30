import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken; // ✅ use correct cookie key

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== process.env.ADMIN_EMAIL && decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    req.adminEmail = decoded.id || decoded.email;
    next();
  } catch (error) {
    logger.error("admin auth error", { error: error.message });
    return res
      .status(500)
      .json({ message: "admin auth error: " + error.message });
  }
};

export default adminAuth;
