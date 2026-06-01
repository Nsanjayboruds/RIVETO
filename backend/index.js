import "./env.js"; 
import { fileURLToPath } from "url";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Swagger.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import botRoute from "./routes/bot.js";

import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoute.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import recommendationsRoute from "./routes/recommendations.js";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "https://riveto-frontend2.onrender.com",
    "https://riveto-admin4.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

connectdb();

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("REQ:", req.method, req.url);
    next();
  });
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/recommendations", recommendationsRoute);
app.use("/api", botRoute);

app.get("/", (req, res) => res.send("Backend is running!"));

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});