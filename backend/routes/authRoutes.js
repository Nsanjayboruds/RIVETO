import express from "express";
// FIX: Using lowercase 'c' for Linux compatibility
import { login, registration, logOut, googleLogin, adminLogin } from "../controller/authcontroller.js";

// Import Validation Middleware
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/registration:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * -QP email
 * - password
 * properties:
 * name:
 * type: string
 * example: "John Doe"
 * email:
 * type: string
 * example: "john@example.com"
 * password:
 * type: string
 * example: "StrongPass123!"
 * responses:
 * 201:
 * description: User registered successfully
 */
authRoutes.post("/registration", validateRequest(registerSchema), registration);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login a user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: "john@example.com"
 * password:
 * type: string
 * example: "StrongPass123!"
 * responses:
 * 200:
 * description: User logged in successfully
 */
authRoutes.post("/login", validateRequest(loginSchema), login);

authRoutes.get("/logout", logOut);
authRoutes.post("/googlelogin", googleLogin);
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;