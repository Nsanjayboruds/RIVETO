import "./env.js";
import { createServer } from "http";
import { initSocket } from "./services/notificationService.js";
import connectdb from "./config/db.js";
import app from "./app.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import recommendationsRoute from "./routes/recommendations.js";
import { globalIpLimiter } from "./middleware/rateLimiters.js";
import errorHandler from "./middleware/errorHandler.js";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import notificationRouter from "./routes/notificationRoutes.js";
import botRoute from "./routes/bot.js";


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

app.use(globalIpLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api/notifications", notificationRouter);
app.use("/api", botRoute);


app.get("/", (req, res) => res.send("Backend is running!"));
app.use(errorHandler);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "frontend/build");
// dotenv.config({ path: path.join(__dirname, ".env") }); // ← explicit path
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
