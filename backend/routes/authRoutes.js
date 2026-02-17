import express from "express";
import { login, registration, logOut, googleLogin, adminLogin } from "../controller/authcontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const authRoutes = express.Router();

// Note: Registration and Login are documented in Swagger.js
authRoutes.post("/registration", validateRequest(registerSchema), registration);
authRoutes.post("/login", validateRequest(loginSchema), login);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error
 */
authRoutes.get("/lout", logOut);

/**
 * @swagger
 * /api/auth/googlelogin:
 *   post:
 *     summary: Login using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *             properties:
 *               tokenId:
 *                 type: string
 *                 description: The token received from Google
 *     responses:
 *       200:
 *         description: Google login successful
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
authRoutes.post("/googlelogin", googleLogin);

/**
 * @swagger
 * /api/auth/adminlogin:
 *   post:
 *     summary: Login for Admin users
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email address
 *               password:
 *                 type: string
 *                 description: Admin password
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Unauthorized credentials
 *       500:
 *         description: Server error
 */
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;