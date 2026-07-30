import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Notification from "../model/notificationModel.js";
import logger from "../config/logger.js";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://riveto-frontend2.onrender.com",
        "https://riveto-admin4.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next();
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;
      const adminToken = cookies.adminToken;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.role = "user";
      } else if (adminToken) {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (decoded.email === process.env.ADMIN_EMAIL) {
          socket.adminEmail = decoded.email;
          socket.role = "admin";
        }
      }
      next();
    } catch (err) {
      logger.error("Socket authentication error", { error: err.message });
      next();
    }
  });

  io.on("connection", (socket) => {
    logger.debug(`Client connected: ${socket.id} (Role: ${socket.role || "anonymous"})`);

    if (socket.userId && socket.role === "user") {
      socket.join(`user_${socket.userId}`);
      logger.debug(`User ${socket.userId} joined room: user_${socket.userId}`);
    } else if (socket.role === "admin") {
      socket.join("admin");
      logger.debug("Admin joined room: admin");
    }

    socket.on("disconnect", () => {
      logger.debug(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitActivity = ({
  type,
  user,
  action,
}) => {
  if (!io) return;

  io.to("admin").emit("userActivity", {
    type,
    user,
    action,
    timestamp: new Date(),
  });
};

export const sendNotification = async ({ userId = null, isAdmin = false, title, message, type }) => {
  try {
    const notification = await Notification.create({
      userId,
      isAdmin,
      title,
      message,
      type,
    });

    logger.debug("Notification saved to DB", { notificationId: notification._id });

    if (io) {
      if (isAdmin) {
        io.to("admin").emit("notification", notification);
        logger.debug("Emitted notification to admin room");
      } else if (userId) {
        io.to(`user_${userId}`).emit("notification", notification);
        logger.debug(` Emitted notification to user_${userId} room`);
      } else {
        io.emit("notification", notification);
        logger.debug(" Emitted global notification");
      }
    } else {
      console.warn("⚠️ Socket.io not initialized, skipping emit");
    }

    return notification;
  } catch (err) {
    logger.error("Error in sendNotification", { error: err.message });
  }
};