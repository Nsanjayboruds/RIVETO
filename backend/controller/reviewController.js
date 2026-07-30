import mongoose from "mongoose";
import Review from "../model/reviewModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import {
  sendNotification,
  emitActivity,
} from "../services/notificationService.js";
import logger from "../config/logger.js";

// 1. Import and initialize the sentiment library
import Sentiment from 'sentiment';
const sentiment = new Sentiment();

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

    // 2. Perform the sentiment analysis on the comment text
    let sentimentScore = 0;
    let sentimentLabel = 'Neutral';

    if (comment && comment.trim().length > 0) {
      const result = sentiment.analyze(comment);
      sentimentScore = result.score;
      
      // Assign labels based on the score threshold
      if (sentimentScore >= 2) sentimentLabel = 'Positive';
      else if (sentimentScore <= -2) sentimentLabel = 'Negative';
    }

    const existingReview = await Review.findOne({
      userId: req.userId,
      productId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      // 3. Update existing review with new sentiment data
      existingReview.sentimentScore = sentimentScore;
      existingReview.sentimentLabel = sentimentLabel;
      
      await existingReview.save();

      const { avgRating, reviewCount } = await recalculateProductRating(productId);

      return res.status(200).json({
        message: "Review updated successfully",
        review: existingReview,
        avgRating,
        reviewCount,
      });
    }

    // 4. Create new review with sentiment data attached
    const newReview = new Review({
      userId: req.userId,
      productId,
      name: user.name,
      rating,
      comment,
      sentimentScore,
      sentimentLabel
    });

    await newReview.save();

    sendNotification({
      isAdmin: true,
      title: "New Product Review",
      message: `${user.name} reviewed "${product.name}" with a ${rating}-star rating.`,
      type: "new_review",
    });

    emitActivity({
      type: "review_added",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      action: `Reviewed "${product.name}" with ${rating} stars`,
    });

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

    logger.error("addReview error", { error: error.message });
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
    logger.error("getProductReviews error", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this review",
      });
    }

    await review.deleteOne();

    const { avgRating, reviewCount } = await recalculateProductRating(
      review.productId
    );

    return res.status(200).json({
      message: "Review deleted successfully",
      avgRating,
      reviewCount,
    });
  } catch (error) {
    logger.error("deleteReview error", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};