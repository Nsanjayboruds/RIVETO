import express from "express";
import { sendOTP, login, logOut, googleLogin, verifyOTP, adminLogin } from "../controller/authcontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";


const authRoutes = express.Router();


authRoutes.post('/send-otp', validateRequest(registerSchema), sendOTP);
authRoutes.post("/verify-otp", verifyOTP);

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
