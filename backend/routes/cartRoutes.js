import express from "express";
import { addToCart, getUserCart, updateCart } from "../controller/cartController.js";
import isAuth from "../middleware/isAuth.js";

const cartRoutes = express.Router();

cartRoutes.post('/get', isAuth, getUserCart);     // ✅ Uses logged-in user from token
cartRoutes.post('/add', isAuth, addToCart);
cartRoutes.post('/update', isAuth, updateCart);

export default cartRoutes;
