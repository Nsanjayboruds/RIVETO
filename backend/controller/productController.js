import uploadOnCloudinary from "../config/Cloudinary.js";
import Product from "../model/productModel.js";

export const addProduct = async (req, res) => {
  console.log("✅ Request files:", req.files);

  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    console.log("✅ Request body:", req.body);
    console.log("✅ Request files:", req.files);

    const image1 = await uploadOnCloudinary(req.files.image1[0].path);
    const image2 = await uploadOnCloudinary(req.files.image2[0].path);
    const image3 = await uploadOnCloudinary(req.files.image3[0].path);
    const image4 = await uploadOnCloudinary(req.files.image4[0].path);

    const productData = {
      name,
      image1,
      image2,
      image3,
      image4,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === 'true'
    };

    const createdProduct = await Product.create(productData);
    return res.status(201).json(createdProduct);

  } catch (error) {
    console.error("❌ Error in addProduct:", error); 
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default addProduct;


export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error in listProducts:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
    
  }
}
export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("❌ Error in removeProduct:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
    
  }
}