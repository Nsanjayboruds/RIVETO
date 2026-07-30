import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { genToken } from "../config/Token.js";
import RefreshToken from "../model/RefreshToken.js"; 
import { sendMail } from "../config/sendEmail.js";
import generateOTP from "../utils/otp.js";
import TempUser from "../model/tempUserModel.js";
import { otpTemplate } from "../utils/otpTemplet.js";
import {
  sendNotification,
  emitActivity,
} from "../services/notificationService.js";
import logger from "../config/logger.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await TempUser.findOneAndDelete({ email });

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    // save temp user
    await TempUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpire: new Date(Date.now() + 5 * 60 * 1000),
    });
    try {
      await sendMail(email, otpTemplate(otp));
    } catch (_error) {
      await TempUser.deleteOne({ email });

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }


    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (_error) {
    logger.error("registration error", { error: _error.message });
    return res.status(500).json({ message: `registration error: ${_error}` });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({ message: "User not found or OTP expired" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (tempUser.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    user.password=undefined;

    await TempUser.deleteOne({ email });

    sendNotification({
      isAdmin: true,
      title: "New User Registered",
      message: `${user.name} (${user.email}) has signed up.`,
      type: "new_user",
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User verified and created",
      user,
    });
  } catch (_error) {
    logger.error("verifyOTP error", { error: _error.message });
    return res.status(500).json({ message: "OTP verification failed" });
  }
};
 
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies; 
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const storedToken = await RefreshToken.findOne({ userId: decoded.id });

    if (!storedToken || !(await bcrypt.compare(refreshToken, storedToken.tokenHash))) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    storedToken.tokenHash = await bcrypt.hash(newRefreshToken, 10);
    storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storedToken.save();

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

    res.json({ message: "Tokens refreshed successfully" });
  } catch (err) {
    res.status(403).json({ message: "Expired or invalid refresh token", error: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.password) {
      return res.status(400).json({
        message: "Please continue with Google or reset your password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  
    const accessToken = generateAccessToken(user._id);   
    const refreshToken = generateRefreshToken(user._id); 

   
    await RefreshToken.create({
      userId: user._id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    
    emitActivity({
      type: "login",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      action: "User logged in",
    });

    user.password=undefined;
    return res.status(200).json(user);
  } catch (_error) {
     logger.error("login error", { error: _error.message });
    
    return res.status(500).json({ message: `login error: ${_error}` });
  }
};



export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, authProvider: "google" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

   
    await RefreshToken.create({
      userId: user._id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password=undefined;
    return res.status(200).json(user);
  } catch (_error) {
    logger.error("google login error", { error: _error.message });
    
    return res.status(500).json({ message: `google login error: ${_error}` });
  }
};


export const logOut = async (req, res) => {
  try {
  
    if (req.user && req.user.id) {
      await RefreshToken.deleteOne({ userId: req.user.id });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.clearCookie("adminRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    emitActivity({
      type: "logout",
      user: req.user ? { id: req.user.id, email: req.user.email } : {},
      action: "User logged out",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (_error) {
    logger.error("logout error", { error: _error.message });
    return res.status(500).json({ message: `logout error: ${_error}` });
  }
};


export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      
      const accessToken = generateAccessToken(email);
      const refreshToken = generateRefreshToken(email);

      res.cookie("adminToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Admin logged in successfully" });
    }
    return res.status(400).json({ message: "Invalid admin credentials" });
  } catch (_error) {
    logger.error("admin login error", { error: _error.message });
    return res.status(500).json({ message: `admin login error: ${_error}` });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (15 mins)
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Create reset URL - Robust version
    let frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    frontendUrl = frontendUrl.replace(/\/+$/, "");
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    if (process.env.NODE_ENV !== "production") {
      logger.debug(`[DEV MODE] PASSWORD RESET LINK: ${resetUrl}`);
    }

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendMail(user.email, message);
      res.status(200).json({ success: true, message: "Email sent" });
    } catch (_error) {
      if (process.env.NODE_ENV !== "production") {
        logger.warn("[DEV MODE] Email failed, but token saved for local testing.");
        return res.status(200).json({ success: true, message: "Reset link generated (check console)" });
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      logger.error("Email sending failed", { error: _error.message });
      return res.status(500).json({ 
        message: "Email could not be sent. Please check SMTP configuration (EMAIL_USER/EMAIL_PASS)." 
      });
    }
  } catch (_error) {
    res.status(500).json({ message: _error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const rawToken = req.params.resetToken;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (_error) {
    res.status(500).json({ message: _error.message });
  }
};