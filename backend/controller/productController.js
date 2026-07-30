import uploadOnCloudinary from "../config/Cloudinary.js";
import Product from "../model/productModel.js";
import { emitActivity } from "../services/notificationService.js";
import Review from "../model/reviewModel.js";
import logger from "../config/logger.js";

const safeUpload = async (fileArray) => {
  const filePath = fileArray?.[0]?.path;

  // If no file was uploaded for this field, safely return null
  if (!filePath) {
    return null;
  }

  // Await the Cloudinary upload
  const uploadResult = await uploadOnCloudinary(filePath);

  // If Cloudinary fails and returns undefined/null, throw an error
  if (!uploadResult) {
    throw new Error("Image upload to Cloudinary failed");
  }

  return uploadResult;
};

export const addProduct = async (req, res) => {
  logger.debug("Request files received", { files: req.files });

  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    logger.debug("Request body received", { body: req.body });

    // Upload images in parallel and tolerate missing files.
    const [image1, image2, image3, image4] = await Promise.all([
      safeUpload(req.files?.image1),
      safeUpload(req.files?.image2),
      safeUpload(req.files?.image3),
      safeUpload(req.files?.image4),
    ]);

    // Validate price before creating the product.
    const priceNumber = Number(price);
    if (price === undefined || price === null || Number.isNaN(priceNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price. A numeric value is required.",
        errors: [],
      });
    }

    // Safely parse sizes; handle invalid JSON or missing sizes gracefully.
    let parsedSizes = [];
    if (sizes) {
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
          if (!Array.isArray(parsedSizes)) {
            return res.status(400).json({
              success: false,
              message: "Invalid sizes: expected a JSON array.",
              errors: [],
            });
          }
        } catch (parseError) {
          logger.error("Invalid sizes JSON in addProduct", { error: parseError.message });
          return res.status(400).json({
            success: false,
            message: "Invalid sizes JSON.",
            errors: [],
          });
        }
      } else if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid sizes: expected an array or JSON string.",
          errors: [],
        });
      }
    }

    const productData = {
      name,
      description,
      price: priceNumber,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: bestseller === "true",
      ...(image1 ? { image1 } : {}),
      ...(image2 ? { image2 } : {}),
      ...(image3 ? { image3 } : {}),
      ...(image4 ? { image4 } : {}),
    };

    const createdProduct = await Product.create(productData);

    emitActivity({
      type: "product_added",
      user: {
        name: "Admin",
      },
      action: `Added product "${createdProduct.name}"`,
    });

    return res.status(201).json(createdProduct);
  } catch (error) {
    logger.error("Error in addProduct", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [error.message],
    });
  }
};

export default addProduct;

export const listProducts = async (req, res) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
      const skip = (page - 1) * limit;

      const { category, subCategory, minPrice, maxPrice, search, sort } = req.query;

      const filter = {};
      if (category) filter.category = category;
      if (subCategory) filter.subCategory = subCategory;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (search) filter.name = { $regex: search, $options: "i" };

      const sortMap = {
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        newest: { createdAt: -1 },
      };
      const sortOption = sortMap[sort] || { _id: 1 };

      const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  
const productsWithReviewCount = await Promise.all(
  products.map(async (product) => {
    const reviewCount = await Review.countDocuments({
      productId: product._id,
    });

    return {
      ...product,
      reviewCount,
    };
  })
);

    return res.status(200).json({
      products : productsWithReviewCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error in listProducts", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [error.message],
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (product) {
      emitActivity({
        type: "product_deleted",
        user: {
          name: "Admin",
        },
        action: `Deleted product "${product.name}"`,
      });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", product });
  } catch (error) {
    logger.error("Error in removeProduct", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [error.message],
    });
  }
};