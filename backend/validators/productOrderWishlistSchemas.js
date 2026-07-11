import Joi from "joi";

// Product Creation
export const productCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),

  description: Joi.string().trim().required().max(2000),

  price: Joi.number().positive().required(),

  category: Joi.string().trim().required().valid("Men", "Women", "Kids", "Accessories", "Footwear", "Beauty", "Home", "Sports", "Electronics", "Other"),

  subCategory: Joi.string().trim().required(),

  sizes: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).min(1),
    Joi.string().trim()
  ),

  bestseller: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string()
  ),

  rating: Joi.number().min(0).max(5),
});

// Product Delete Params
export const deleteProductSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
});

// Order Placement
export const placeOrderSchema = Joi.object({
  items: Joi.array()
    .min(1)
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  address: Joi.object()
    .required()
});

// Order Status Update
export const updateOrderStatusSchema = Joi.object({
  orderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),

  status: Joi.string()
    .required()
});

// Wishlist Add / Remove
export const wishlistSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
});