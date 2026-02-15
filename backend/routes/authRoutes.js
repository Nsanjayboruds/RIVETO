import express from "express";
import { login, registration, logOut, googleLogin, adminLogin } from "../controller/authcontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";

const authRoutes = express.Router();

// Routes are now documented in Swagger.js to avoid crash errors
authRoutes.post("/registration", validateRequest(registerSchema), registration);
authRoutes.post("/login", validateRequest(loginSchema), login);

authRoutes.get("/logout", logOut);
authRoutes.post("/googlelogin", googleLogin);
authRoutes.post("/adminlogin", adminLogin);

export default authRoutes;