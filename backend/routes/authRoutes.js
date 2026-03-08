import express from "express";
import { login, registration, logOut, googleLogin, adminLogin } from "../controller/authcontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 */
authRoutes.post("/registration", validateRequest(registerSchema), registration);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1Ni..."
 */
authRoutes.post("/login", validateRequest(loginSchema), login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
authRoutes.post("/logout", logOut);

/**
 * @swagger
 * /api/auth/googlelogin:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 */
authRoutes.post("/googlelogin", googleLogin);

/**
 * @swagger
 * /api/auth/adminlogin:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 */
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;