import "./env.js";
import { createServer } from "http";
import { initSocket } from "./services/notificationService.js";
import connectdb from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const server = createServer(app);

connectdb();
initSocket(server);

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("REQ:", req.method, req.url);
    next();
  });
}

const errorHandler = (err) => {
  console.error("❌ Unhandled error:", err);
  server.close(() => {
    console.log("🛑 Server closed due to unhandled error");
    process.exit(1);
  });
  setTimeout(() => {
    console.error("⏱️ Force exit after timeout");
    process.exit(1);
  }, 10000);
};

process.on("unhandledRejection", (reason) => {
  console.error("🔴 Unhandled Rejection at:", new Date().toISOString());
  errorHandler(reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔴 Uncaught Exception at:", new Date().toISOString());
  errorHandler(err);
});

process.on("SIGTERM", () => {
  console.log("📥 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📥 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
