import dotenv from "dotenv";
import cookieParser from 'cookie-parser'; 
dotenv.config();
import swaggerUi from 'swagger-ui-express';
// Ensure this matches the default export from Swagger.js
import swaggerSpecs from './Swagger.js'; 

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import database & routes
import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. PUBLIC DOCUMENTATION (MUST BE AT TOP) ---
// This sits above EVERYTHING to bypass all middleware/auth logic
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- 2. GLOBAL MIDDLEWARE ---
app.use(cors({
  origin: ["https://riveto-frontend2.onrender.com", "https://riveto-admin4.onrender.com", "http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// --- 3. DATABASE & API ROUTES ---
connectdb();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// --- 4. FRONTEND SERVING ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, "frontend/build");

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});