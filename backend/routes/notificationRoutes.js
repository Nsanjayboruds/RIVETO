import express from "express";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import Notification from "../model/notificationModel.js";
import { userRateLimiter, adminRateLimiter } from "../middleware/rateLimiters.js";
import logger from "../config/logger.js";

const router = express.Router();

// GET /api/notifications - User notifications
router.get("/", isAuth, userRateLimiter, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json(notifications);
  } catch (error) {
    logger.error("Error fetching user notifications", { error: error.message });
    return res.status(500).json({ message: "Server error fetching notifications" });
  }
});

// GET /api/notifications/admin - Admin notifications
router.get("/admin", adminAuth, adminRateLimiter, async (req, res) => {
  try {
    const notifications = await Notification.find({ isAdmin: true })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json(notifications);
  } catch (error) {
    logger.error("Error fetching admin notifications", { error: error.message });
    return res.status(500).json({ message: "Server error fetching admin notifications" });
  }
});

// PUT /api/notifications/read-all-user - Mark all read for User
router.put("/read-all-user", isAuth, userRateLimiter, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    return res.status(200).json({ success: true, message: "All user notifications marked as read" });
  } catch (error) {
    logger.error("Error marking all user notifications read", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/notifications/read-all-admin - Mark all read for Admin
router.put("/read-all-admin", adminAuth, adminRateLimiter, async (req, res) => {
  try {
    await Notification.updateMany({ isAdmin: true, read: false }, { read: true });
    return res.status(200).json({ success: true, message: "All admin notifications marked as read" });
  } catch (error) {
    logger.error("Error marking all admin notifications read", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/notifications/:id/read - Mark single notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    logger.error("Error marking notification read", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/notifications/:id - Delete single notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    logger.error("Error deleting notification", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
