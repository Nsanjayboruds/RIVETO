import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  clearCart
} from "../controller/cartController.js";
import isAuth from "../middleware/isAuth.js";
import validateRequest from "../middleware/validateRequest.js";
import { addToCartSchema, updateCartSchema } from "../validators/authSchemas.js";
import { userRateLimiter } from "../middleware/rateLimiters.js";

const cartRoutes = express.Router();

cartRoutes.use(isAuth, userRateLimiter);
cartRoutes.post("/get", getUserCart);
cartRoutes.post("/add", validateRequest(addToCartSchema), addToCart);
cartRoutes.post("/update", validateRequest(updateCartSchema), updateCart);
cartRoutes.post('/clear', isAuth, clearCart);

export default cartRoutes;
