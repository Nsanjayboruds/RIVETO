import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/Token.js";
import { sendMail } from "../config/sendEmail.js";
import generateOTP from "../utils/otp.js";
import TempUser from "../model/tempUserModel.js";
import { otpTemplate } from "../utils/otpTemplet.js";

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
