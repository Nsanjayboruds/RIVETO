import User from "../model/userModel.js";


// add product
export const addToWishlist = async (req, res) => {
  try {

    const userId = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
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

    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: user.wishlist
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
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

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};