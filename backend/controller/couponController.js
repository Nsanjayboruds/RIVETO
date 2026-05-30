import Coupon from "../model/couponModel.js";

// Validate a coupon code during checkout
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Promo code is required" });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid promo code" });
    }

    // Check if active
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "This promo code is no longer active" });
    }

    // Check expiration date
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: "This promo code has expired" });
    }

    // Check usage limits
    if (coupon.maxUses !== null && coupon.timesUsed >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: "This promo code has reached its usage limit" });
    }

    // Valid coupon! Return details
    res.status(200).json({
      success: true,
      message: "Promo code applied successfully",
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin route to create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscountAmount, expiryDate, maxUses } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({
      code,
      discountPercentage,
      maxDiscountAmount: maxDiscountAmount || 50,
      expiryDate: new Date(expiryDate),
      maxUses: maxUses || null,
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
