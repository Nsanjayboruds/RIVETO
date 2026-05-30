import express from "express";
import { validateCoupon, createCoupon } from "../controller/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/validate", validateCoupon); // Typically auth not strictly needed just to check if code is valid, but can be added. We'll leave it open so the cart updates for guests too.
couponRouter.post("/create", createCoupon); // In a real app this should have an admin middleware

export default couponRouter;
