import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controller/wishlistController.js";

import isAuth from "../middleware/isAuth.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", isAuth, addToWishlist);

wishlistRouter.post("/remove", isAuth, removeFromWishlist);

wishlistRouter.get("/", isAuth, getWishlist);

export default wishlistRouter;