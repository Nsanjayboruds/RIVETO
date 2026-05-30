import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    maxDiscountAmount: {
      type: Number,
      default: 50, // maximum discount in currency (e.g., 50 rupees/dollars max)
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    maxUses: {
      type: Number,
      default: null, // null means unlimited uses
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
