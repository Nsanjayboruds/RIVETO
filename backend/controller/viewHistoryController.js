import mongoose from "mongoose";
import ViewHistory from "../model/viewHistoryModel.js";
import DismissedPick from "../model/dismissedPickModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import Order from "../model/orderModel.js";
import logger from "../config/logger.js";

// Cap on how many view-history rows we keep per user.
const MAX_HISTORY = 20;
// How many products each "row" returns by default.
const DEFAULT_LIMIT = 8;

// ✅ Log a product view (called from the product detail page).
// Debounced on the frontend so refreshing the same page doesn't spam entries;
// here we also de-dupe at the DB level via upsert so re-viewing a product
// just bumps its timestamp instead of creating a new row.
export const logView = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid productId is required" });
    }

    await ViewHistory.findOneAndUpdate(
      { userId, productId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    // Trim history beyond MAX_HISTORY, keeping only the most recent entries.
    const staleEntries = await ViewHistory.find({ userId })
      .sort({ viewedAt: -1 })
      .skip(MAX_HISTORY)
      .select("_id");

    if (staleEntries.length) {
      await ViewHistory.deleteMany({
        _id: { $in: staleEntries.map((entry) => entry._id) },
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error in logView", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get the logged-in user's recently viewed products, most recent first.
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(
      Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1),
      MAX_HISTORY
    );

    const history = await ViewHistory.find({ userId })
      .sort({ viewedAt: -1 })
      .limit(limit)
      .populate("productId");

    // A viewed product may have been deleted/removed since — skip those.
    const products = history
      .filter((entry) => entry.productId)
      .map((entry) => entry.productId);

    return res.status(200).json({ success: true, products });
  } catch (error) {
    logger.error("Error in getRecentlyViewed", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ "Clear history" button on the homepage.
export const clearViewHistory = async (req, res) => {
  try {
    await ViewHistory.deleteMany({ userId: req.userId });
    return res
      .status(200)
      .json({ success: true, message: "Viewing history cleared" });
  } catch (error) {
    logger.error("Error in clearViewHistory", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Remove a single product from Recently Viewed (the "✕" on each card).
export const removeViewedItem = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    await ViewHistory.deleteOne({ userId: req.userId, productId });
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error in removeViewedItem", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Dismiss a single product from Picks For You (the "✕" on each card).
// Picks are computed live, not stored, so "removing" one means remembering
// not to recommend it again rather than deleting a row.
export const dismissPick = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    await DismissedPick.findOneAndUpdate(
      { userId: req.userId, productId },
      { dismissedAt: new Date() },
      { upsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error in dismissPick", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Simple rule-based "Picks For You":
// score categories using wishlist + cart only (no ML needed for v1),
// exclude anything already purchased/wishlisted/in cart/dismissed, and fall
// back to trending/best-seller items when there isn't enough signal yet.
export const getPicksForYou = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1), 20);

    const user = await User.findById(userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartProductIds = Object.keys(user.cartData || {}).filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    const cartProducts = cartProductIds.length
      ? await Product.find({ _id: { $in: cartProductIds } })
      : [];

    const orders = await Order.find({ userId: userId.toString() });
    const dismissed = await DismissedPick.find({ userId }).select("productId");

    // --- Build a category -> score map from wishlist + cart only ---
    // (Recently viewed is intentionally excluded — it's a separate signal
    // shown in its own "Recently Viewed" section, not a personalization input here.)
    const categoryScore = {};
    const bumpCategory = (category, weight) => {
      if (!category) return;
      categoryScore[category] = (categoryScore[category] || 0) + weight;
    };

    (user.wishlist || []).forEach((product) => bumpCategory(product?.category, 3));
    cartProducts.forEach((product) => bumpCategory(product?.category, 3));

    const topCategories = Object.entries(categoryScore)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    // --- Exclusions: don't recommend what the user already has/bought/dismissed ---
    const purchasedIds = orders.flatMap((order) =>
      (order.items || []).map((item) => String(item._id))
    );
    const wishlistIds = (user.wishlist || []).map((product) => String(product._id));
    const dismissedIds = dismissed.map((entry) => String(entry.productId));
    const excludeIds = [
      ...new Set([...purchasedIds, ...wishlistIds, ...cartProductIds, ...dismissedIds]),
    ];

    let picks = [];

    if (topCategories.length) {
      picks = await Product.find({
        category: { $in: topCategories },
        _id: { $nin: excludeIds },
      })
        .sort({ popularity: -1, rating: -1 })
        .limit(limit);
    }

    // --- Fallback for new users / not enough personalized matches yet ---
    if (picks.length < limit) {
      const alreadyPicked = picks.map((product) => String(product._id));
      const fallback = await Product.find({
        _id: { $nin: [...excludeIds, ...alreadyPicked] },
      })
        .sort({ bestseller: -1, popularity: -1 })
        .limit(limit - picks.length);

      picks = [...picks, ...fallback];
    }

    return res.status(200).json({ success: true, products: picks });
  } catch (error) {
    logger.error("Error in getPicksForYou", { error: error.message });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
