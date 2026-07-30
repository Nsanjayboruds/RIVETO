import express from "express";
import {
  sendOTP,
  login,
  logOut,
  googleLogin,
  verifyOTP,
  adminLogin,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controller/authcontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authSchemas.js";
import { authIpLimiter, otpIpLimiter } from "../middleware/rateLimiters.js";
import protect from "../middleware/isAuth.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import RefreshToken from "../model/RefreshToken.js";
import bcrypt from "bcryptjs";

const authRoutes = express.Router();

authRoutes.get("/github", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Please log in first to connect GitHub" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = "repo,read:user";
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${token}`;
    return res.redirect(githubUrl);
  } catch (_err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

authRoutes.get("/github/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code) {
    return res.status(400).json({ message: "Authorization code missing" });
  }

  try {
    let userId;
    try {
      const decoded = jwt.verify(state, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (_err) {
      return res.status(401).json({ message: "Invalid OAuth state / session expired" });
    }

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.status(400).json({ message: "Failed to retrieve access token from GitHub" });
    }

    await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": "RIVETO-App",
      },
    });

    const encryptedToken = encrypt(access_token);
    const user = await User.findByIdAndUpdate(
      userId,
      { githubAccessToken: encryptedToken },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      {
        tokenHash: await bcrypt.hash(newRefreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl.replace(/\/+$/, "")}/recommendations`);
  } catch (error) {
    console.error("GitHub OAuth Callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl.replace(/\/+$/, "")}/recommendations?error=oauth_failed`);
  }
});

authRoutes.get("/github/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("+githubAccessToken");
    if (!user || !user.githubAccessToken) {
      return res.json({ connected: false });
    }

    const decryptedToken = decrypt(user.githubAccessToken);
    if (!decryptedToken) {
      return res.json({ connected: false });
    }

    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
        "User-Agent": "RIVETO-App",
      },
    });

    const { avatar_url, login, public_repos } = profileResponse.data;
    return res.json({
      connected: true,
      avatar_url,
      login,
      public_repos,
    });
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error.message);
    return res.status(500).json({ error: "Failed to fetch GitHub profile" });
  }
});

authRoutes.post("/send-otp", otpIpLimiter, validateRequest(registerSchema), sendOTP);
authRoutes.post("/verify-otp", otpIpLimiter, verifyOTP);

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
 *         headers:
 *           Set-Cookie:
 *             description: Contains httpOnly 'token' and 'refreshToken' cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 authProvider:
 *                   type: string
 */
authRoutes.post("/login", authIpLimiter, validateRequest(loginSchema), login);

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
authRoutes.post("/logout", protect, logOut);

/**
 * @swagger
 * /api/auth/googlelogin:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Contains httpOnly 'token' and 'refreshToken' cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 authProvider:
 *                   type: string
 */
authRoutes.post("/googlelogin", authIpLimiter, googleLogin);

/**
 * @swagger
 * /api/auth/adminlogin:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Admin login successful
 *         headers:
 *           Set-Cookie:
 *             description: Contains httpOnly 'adminToken' and 'adminRefreshToken' cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin logged in successfully"
 */
authRoutes.post("/adminlogin", authIpLimiter, adminLogin);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 */
authRoutes.post("/refresh", refreshToken);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.put("/reset-password/:resetToken", resetPassword);

export default authRoutes;
