import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlistController.js";

import isAuth from "../middleware/isAuth.js";
import { userRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  wishlistSchema,
} from "../validators/productOrderWishlistSchemas.js";

const wishlistRouter = express.Router();

wishlistRouter.use(isAuth, userRateLimiter);
wishlistRouter.post("/add", validateRequest(wishlistSchema), addToWishlist);
wishlistRouter.post("/remove", validateRequest(wishlistSchema), removeFromWishlist);
wishlistRouter.get("/", getWishlist);

export default wishlistRouter;