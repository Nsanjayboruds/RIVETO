import express from "express";
import upload from "../middleware/Multer.js";
import {
  addProduct,
  listProducts,
  removeProduct,
} from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";
import { adminRateLimiter } from "../middleware/rateLimiters.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  productCreateSchema,
  deleteProductSchema,
} from "../validators/productOrderWishlistSchemas.js";

let productRoutes = express.Router();

productRoutes.post(
  "/addproduct",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  validateRequest(productCreateSchema),
  addProduct,
);

productRoutes.get("/list", listProducts);
productRoutes.post("/remove/:id", adminAuth, adminRateLimiter, validateRequest(deleteProductSchema, "params"), removeProduct);

export default productRoutes;
