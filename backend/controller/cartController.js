import User from "../model/userModel.js";
import { emitActivity } from "../services/notificationService.js";
import logger from "../config/logger.js";

// ✅ Add to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    if (!userId || !itemId || !size) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const userData = await User.findById(userId);
    if (!userData) return res.status(404).json({ message: "User not found" });

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await User.findByIdAndUpdate(userId, { cartData });

    emitActivity({
      type: "cart_added",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      },
      action: `Added item ${itemId} (size ${size}) to cart`,
    });

    return res.status(201).json({ message: "Added to cart" });
  } catch (error) {
    logger.error("addToCart error", { error: error.message });
    return res.status(500).json({ message: "addToCart error" });
  }
};

// ✅ Update cart
export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userData = await User.findById(req.userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;

    await User.findByIdAndUpdate(req.userId, { cartData });

    emitActivity({
      type: "cart_updated",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      },
      action: `Updated quantity of item ${itemId} (${size}) to ${quantity}`,
    });

    return res.status(201).json({ message: "Cart updated" });
  } catch (error) {
    logger.error("updateCart error", { error: error.message });
    return res.status(500).json({ message: "updateCart error" });
  }
};

// ✅ Get cart
export const getUserCart = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    return res.status(200).json(userData.cartData || {});
  } catch (error) {
    logger.error("getUserCart error", { error: error.message });
    return res.status(500).json({ message: "getUserCart error" });
  }
};
// ✅ Clear cart entirely
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Missing user ID" });

    await User.findByIdAndUpdate(userId, { cartData: {} });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    logger.error("clearCart error:", {error: error.message});
    return res.status(500).json({ message: "clearCart error" });
  }
};
