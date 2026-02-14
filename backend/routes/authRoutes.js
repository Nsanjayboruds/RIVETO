import express from 'express';
import { registration, login, logOut, googleLogin, adminLogin } from '../controller/authcontroller.js';

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
 * - email
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


authRoutes.post("/registration", registration);
authRoutes.post("/login", login);
authRoutes.get("/logout", logOut);
authRoutes.post("/googlelogin", googleLogin);
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;