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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/product/addproduct:
 *   post:
 *     summary: Add a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - subCategory
 *               - sizes
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 example: "Classic Cotton T-Shirt"
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "Comfortable cotton t-shirt for everyday wear"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 enum: [Men, Women, Kids, Accessories, Footwear, Beauty, Home, Sports, Electronics, Other]
 *                 example: "Men"
 *               subCategory:
 *                 type: string
 *                 example: "T-Shirts"
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 example: ["S", "M", "L", "XL"]
 *               bestseller:
 *                 type: boolean
 *                 example: false
 *               image1:
 *                 type: string
 *                 format: binary
 *               image2:
 *                 type: string
 *                 format: binary
 *               image3:
 *                 type: string
 *                 format: binary
 *               image4:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Admin authentication required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/list:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: List of products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/remove/{id}:
 *   post:
 *     summary: Remove a product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized - Admin authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         name:
 *           type: string
 *           example: "Classic Cotton T-Shirt"
 *         description:
 *           type: string
 *           example: "Comfortable cotton t-shirt for everyday wear"
 *         price:
 *           type: number
 *           example: 29.99
 *         category:
 *           type: string
 *           example: "Men"
 *         subCategory:
 *           type: string
 *           example: "T-Shirts"
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["S", "M", "L", "XL"]
 *         bestseller:
 *           type: boolean
 *           example: false
 *         image1:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/xxx/image1.jpg"
 *         image2:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/xxx/image2.jpg"
 *         image3:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/xxx/image3.jpg"
 *         image4:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/xxx/image4.jpg"
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         popularity:
 *           type: integer
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

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
productRoutes.post(
  "/remove/:id",
  adminAuth,
  adminRateLimiter,
  validateRequest(deleteProductSchema, "params"),
  removeProduct,
);

export default productRoutes;
