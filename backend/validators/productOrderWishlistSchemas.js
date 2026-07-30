import Joi from "joi";

// Product Creation
export const productCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),

  description: Joi.string().trim().required(),

  price: Joi.number().positive().required(),

  category: Joi.string().required(),

  subCategory: Joi.string().required(),

  sizes: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),

  bestseller: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string()
  ),
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