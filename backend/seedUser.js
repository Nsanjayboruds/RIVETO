import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./model/userModel.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const email = "test@example.com";
    const password = "password123";

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await User.create({
      name: "Test User",
      email,
      password: hashedPassword,
    });

    console.log("✅ Seed user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seed();
