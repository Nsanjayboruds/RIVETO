import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "../controller/reviewController.js";
import authUser from "../middleware/isAuth.js";
import validateRequest from "../middleware/validateRequest.js";
import { addReviewSchema } from "../validators/authSchemas.js";
import { userRateLimiter } from "../middleware/rateLimiters.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/add",
  authUser,
  userRateLimiter,
  validateRequest(addReviewSchema),
  addReview
);

reviewRouter.get("/:productId", getProductReviews);

reviewRouter.delete(
  "/:reviewId",
  authUser,
  userRateLimiter,
  deleteReview
);

export default reviewRouter;