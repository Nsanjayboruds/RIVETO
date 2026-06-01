import uploadOnCloudinary from "../config/Cloudinary.js";
import Product from "../model/productModel.js";

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
  console.log("✅ Request files:", req.files);

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

    console.log("✅ Request body:", req.body);

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
      return res
        .status(400)
        .json({ message: "Invalid price. A numeric value is required." });
    }

    // Safely parse sizes; handle invalid JSON or missing sizes gracefully.
    let parsedSizes = [];
    if (sizes) {
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
          if (!Array.isArray(parsedSizes)) {
            return res
              .status(400)
              .json({ message: "Invalid sizes: expected a JSON array." });
          }
        } catch (parseError) {
          console.error("❌ Invalid sizes JSON in addProduct:", parseError);
          return res.status(400).json({ message: "Invalid sizes JSON." });
        }
      } else if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else {
        return res
          .status(400)
          .json({
            message: "Invalid sizes: expected an array or JSON string.",
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
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error in addProduct:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default addProduct;

export const listProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({}).sort({ _id: 1 }).skip(skip).limit(limit),
      Product.countDocuments({}),
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error in listProducts:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("❌ Error in removeProduct:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
