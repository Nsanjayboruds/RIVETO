import mongoose from "mongoose";
import Review from "../model/reviewModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

async function recalculateProductRating(productId) {
  const result = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = result.length > 0 ? parseFloat(result[0].avgRating.toFixed(1)) : 0;
  const reviewCount = result.length > 0 ? result[0].count : 0;

  await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewCount });

  return { avgRating, reviewCount };
}

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const [user, product] = await Promise.all([
      User.findById(req.userId),
      Product.findById(productId),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      userId: req.userId,
      productId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      const { avgRating, reviewCount } = await recalculateProductRating(productId);

      return res.status(200).json({
        message: "Review updated successfully",
        review: existingReview,
        avgRating,
        reviewCount,
      });
    }

    const newReview = new Review({
      userId: req.userId,
      productId,
      name: user.name,
      rating,
      comment,
    });

    await newReview.save();

    const { avgRating, reviewCount } = await recalculateProductRating(productId);

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
      avgRating,
      reviewCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this product" });
    }

    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
