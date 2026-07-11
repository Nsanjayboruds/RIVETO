import { fileURLToPath } from "url";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Swagger.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

import botRoute from "./routes/bot.js";
import notificationRouter from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import recommendationsRoute from "./routes/recommendations.js";
import { globalIpLimiter } from "./middleware/rateLimiters.js";
import { corsOptions } from "./config/cors.js";

const app = express();

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api", globalIpLimiter);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("Backend is running!"));

// Serve frontend build if exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "frontend/build");

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

export default app;
