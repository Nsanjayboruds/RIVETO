import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { genToken, genToken1 } from "../config/Token.js";
import { sendMail, isEmailConfigured } from "../config/sendEmail.js";
import generateOTP from "../utils/otp.js";
import TempUser from "../model/tempUserModel.js";
import { otpTemplate } from "../utils/otpTemplet.js";
import { sendNotification } from "../services/notificationService.js";

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

    if (!isEmailConfigured()) {
      await TempUser.deleteOne({ email });

      return res.status(503).json({
        success: false,
        message: "Email service is not configured",
      });
    }

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
    console.log("registration error:", _error);
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
    console.log("verifyOTP error:", _error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (_error) {
    console.log("login error:", _error);
    return res.status(500).json({ message: `login error: ${_error}` });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (_error) {
    console.log("google login error:", _error);
    return res.status(500).json({ message: `google login error: ${_error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (_error) {
    console.log("logout error:", _error);
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
      const token = await genToken1(email);
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(token);
    }
    return res.status(400).json({ message: "Invalid admin credentials" });
  } catch (_error) {
    console.log("admin login error:", _error);
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
      console.log(`[DEV MODE] PASSWORD RESET LINK: ${resetUrl}`);
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
        console.log("[DEV MODE] Email failed, but token saved for local testing.");
        return res.status(200).json({ success: true, message: "Reset link generated (check console)" });
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      console.error("EMAIL SENDING FAILED:", _error.message);
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
