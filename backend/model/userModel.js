import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
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

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
    },

    cartData: {
      type: Object,
      default: {},
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: {
      type: [addressSchema],
      default: [],
    },

    resetPasswordToken: {type: String, select: false},
    resetPasswordExpire: {type: Date, select: false},
    githubAccessToken: { type: String, select: false },
  },
  {
    timestamps: true,
    minimize: false, // prevents empty objects from being removed
  }
);

const User = mongoose.model("User", userSchema);

export default User;
