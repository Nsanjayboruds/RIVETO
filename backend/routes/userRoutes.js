import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getAdmin, getCurrentUser } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  userRateLimiter,
  adminRateLimiter,
} from "../middleware/rateLimiters.js";

let userRoutes = express.Router();

userRoutes.get(
  "/getCurrentUser",
  isAuth,
  userRateLimiter,
  getCurrentUser
);

userRoutes.get(
  "/getadmin",
  isAuth,
  authorizeRoles("admin", "super_admin"),
  adminRateLimiter,
  getAdmin
);

export default userRoutes;