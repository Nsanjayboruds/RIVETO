import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpire: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TempUser = mongoose.model("TempUser", tempUserSchema);

export default TempUser;
