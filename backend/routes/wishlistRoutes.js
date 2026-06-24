import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlistController.js";

import isAuth from "../middleware/isAuth.js";
import { userRateLimiter } from "../middleware/rateLimiters.js";

const wishlistRouter = express.Router();

wishlistRouter.use(isAuth, userRateLimiter);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.post("/remove", removeFromWishlist);
wishlistRouter.get("/", getWishlist);

export default wishlistRouter;