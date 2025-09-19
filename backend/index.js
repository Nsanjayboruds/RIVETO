import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

import cors from "cors";
import cookieParser from "cookie-parser";

import connectdb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";



// Middleware


app.use(cors({
  origin:[ "http://localhost:5173" , "http://localhost:5174"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)
// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  connectdb();
});
