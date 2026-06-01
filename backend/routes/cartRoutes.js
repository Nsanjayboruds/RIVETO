import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controller/cartController.js";
import isAuth from "../middleware/isAuth.js";
import validateRequest from "../middleware/validateRequest.js";
import { addToCartSchema, updateCartSchema } from "../validators/authSchemas.js";

const cartRoutes = express.Router();

cartRoutes.post('/get', isAuth, getUserCart);     // ✅ Uses logged-in user from token
cartRoutes.post('/add', isAuth,validateRequest(addToCartSchema), addToCart);
cartRoutes.post('/update', isAuth,validateRequest(updateCartSchema), updateCart);

export default cartRoutes;
