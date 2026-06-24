import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getAdmin, getCurrentUser } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import { userRateLimiter, adminRateLimiter } from "../middleware/rateLimiters.js";

let userRoutes = express.Router();

userRoutes.get("/getCurrentUser", isAuth, userRateLimiter, getCurrentUser);
userRoutes.get("/getadmin", adminAuth, adminRateLimiter, getAdmin);

export default userRoutes;
