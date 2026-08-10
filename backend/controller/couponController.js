import Coupon from "../model/couponModel.js";
import logger from "../config/logger.js";

export const validateCouponForOrder = async (code, subtotal) => {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }
  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is no longer active" };
  }
  if (coupon.expiryDate < new Date()) {
    return { valid: false, message: "This coupon has expired" };
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`,
    };
  }

  const discount =
    coupon.discountType === "percentage"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, subtotal); // never discount below zero

  return { valid: true, coupon, discount, finalAmount: subtotal - discount };
};

// POST /api/coupon/validate — preview only, does not consume usage
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = await validateCouponForOrder(code, subtotal);

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      discount: result.discount,
      finalAmount: result.finalAmount,
    });
  } catch (error) {
    logger.error("validateCoupon error", { error: error.message });
    return res.status(500).json({ success: false, message: "Coupon validation failed" });
  }
};

// Admin CRUD
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A coupon with this code already exists" });
    }
    logger.error("createCoupon error", { error: error.message });
    return res.status(500).json({ success: false, message: "Failed to create coupon" });
  }
};

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    logger.error("listCoupons error", { error: error.message });
    return res.status(500).json({ success: false, message: "Failed to fetch coupons" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    logger.error("updateCoupon error", { error: error.message });
    return res.status(500).json({ success: false, message: "Failed to update coupon" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    logger.error("deleteCoupon error", { error: error.message });
    return res.status(500).json({ success: false, message: "Failed to delete coupon" });
  }
};