import express from "express";
import { validateCoupon, createCoupon } from "../controller/couponController.js";
import authUser from "../middleware/isAuth.js"; // if they have it, though usually promo codes don't strictly require auth unless you want to limit to logged-in users. We will use it just in case, but let's look at `orderRoute.js` to see if they use it.

const couponRouter = express.Router();

couponRouter.post("/validate", validateCoupon); // Typically auth not strictly needed just to check if code is valid, but can be added. We'll leave it open so the cart updates for guests too.
couponRouter.post("/create", createCoupon); // In a real app this should have an admin middleware

export default couponRouter;
