import express from "express";
import {
  validateCoupon,
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controller/couponController.js";
import adminAuth from "../middleware/adminAuth.js";
import isAuth from "../middleware/isAuth.js";
import { adminRateLimiter, userRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createCouponSchema,
  updateCouponSchema,
  couponIdParamSchema,
  validateCouponSchema,
} from "../validators/couponSchemas.js";

const couponRoutes = express.Router();

// User-facing: preview a discount before checkout
couponRoutes.post(
  "/validate",
  isAuth,
  userRateLimiter,
  validateRequest(validateCouponSchema),
  validateCoupon
);

// Admin management
couponRoutes.post(
  "/",
  adminAuth,
  adminRateLimiter,
  validateRequest(createCouponSchema),
  createCoupon
);
couponRoutes.get("/", adminAuth, adminRateLimiter, listCoupons);
couponRoutes.put(
  "/:id",
  adminAuth,
  adminRateLimiter,
  validateRequest(couponIdParamSchema, "params"),
  validateRequest(updateCouponSchema),
  updateCoupon
);
couponRoutes.delete(
  "/:id",
  adminAuth,
  adminRateLimiter,
  validateRequest(couponIdParamSchema, "params"),
  deleteCoupon
);

export default couponRoutes;