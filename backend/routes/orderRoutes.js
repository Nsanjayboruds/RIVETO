import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  allOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import { userRateLimiter, adminRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  placeOrderSchema,
  updateOrderStatusSchema,
} from "../validators/productOrderWishlistSchemas.js";


const orderRoutes = express.Router();

orderRoutes.post("/placeorder", isAuth, validateRequest(placeOrderSchema), userRateLimiter, placeOrder);
orderRoutes.post("/userorder", isAuth, userRateLimiter, userOrders);

orderRoutes.post("/list", adminAuth, adminRateLimiter, allOrders);
orderRoutes.post("/status", adminAuth, adminRateLimiter,  validateRequest(updateOrderStatusSchema), updateStatus);

export default orderRoutes;
