import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser, getAnalytics } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  userRateLimiter,
  adminRateLimiter,
} from "../middleware/rateLimiters.js";

let userRoutes = express.Router();

userRoutes.get("/getCurrentUser", isAuth, userRateLimiter, getCurrentUser);
userRoutes.get("/analytics", adminAuth, adminRateLimiter, getAnalytics);

export default userRoutes;
