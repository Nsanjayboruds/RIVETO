import express from 'express';
import { registration, login, logOut, googleLogin, adminLogin } from '../controller/authcontroller.js';

 
const authRoutes =express.Router();

authRoutes.post("/registration", registration)
authRoutes.post("/login",login) 
authRoutes.get("/logout", logOut)  // Add logout route
authRoutes.post("/googlelogin", googleLogin)  // Add google login route
authRoutes.post("/adminlogin", adminLogin)  // Add admin login route

export default authRoutes;