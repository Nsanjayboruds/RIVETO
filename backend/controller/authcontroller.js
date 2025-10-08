import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/Token.js";

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log("registration error:", error);
    return res.status(500).json({ message: `registration error: ${error}` });
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
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("login error:", error);
    return res.status(500).json({ message: `login error: ${error}` });
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
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("google login error:", error);
    return res.status(500).json({ message: `google login error: ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
       maxAge: 7 * 24 * 60 * 60 * 1000

    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("logout error:", error);
    return res.status(500).json({ message: `logout error: ${error}` });
  }
};


export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await genToken1(email);
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000
      });
      return res.status(200).json(token);
    }
        return res.status(400).json({ message: "Invalid admin credentials" });
  } catch (error) {
    console.log("admin login error:", error);
    return res.status(500).json({ message: `admin login error: ${error}` });
  }
}
