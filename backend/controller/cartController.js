import User from "../model/userModel.js";

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
    return res.status(201).json({ message: "Added to cart" });
  } catch (error) {
    console.log("addToCart error:", error);
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
    return res.status(201).json({ message: "Cart updated" });
  } catch (error) {
    console.log("updateCart error:", error);
    return res.status(500).json({ message: "updateCart error" });
  }
};

// ✅ Get cart
export const getUserCart = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    return res.status(200).json(userData.cartData || {});
  } catch (error) {
    console.log("getUserCart error:", error);
    return res.status(500).json({ message: "getUserCart error" });
  }
};
