import User from "../model/userModel.js";
import { emitActivity } from "../services/notificationService.js";
import logger from "../config/logger.js";


// add product
export const addToWishlist = async (req, res) => {
  try {

    const userId = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();

      emitActivity({
        type: "wishlist_added",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        action: `Added product ${productId} to wishlist`,
      });
    }

    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {

    logger.error("addToWishlist error", { error: error.message });

    res.status(500).json({
      success: false,
      message: "Server error",
      errors: [error.message],
    });
  }
};


// remove product
export const removeFromWishlist = async (req, res) => {
  try {

    const userId = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId
    );

    await user.save();

    emitActivity({
      type: "wishlist_removed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      action: `Removed product ${productId} from wishlist`,
    });

    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {

    logger.error("removeFromWishlist error", { error: error.message });

    res.status(500).json({
      success: false,
      message: "Server error",
      errors: [error.message],
    });
  }
};


// get wishlist
export const getWishlist = async (req, res) => {
  try {

    const userId = req.userId;

    const user = await User.findById(userId)
      .populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });

  } catch (error) {

    logger.error("getWishlist error", { error: error.message });

    res.status(500).json({
      success: false,
      message: "Server error",
      errors: [error.message],
    });
  }
};