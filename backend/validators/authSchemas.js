import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters",
    "any.required": "Name is a required field",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is a required field",
  }),

  // FIX: Updated min length to 8 to match controller
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is a required field",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is a required field",
  }),


  password: Joi.string()
    .min(8)
    .required()
});

export const addToCartSchema = Joi.object({
  itemId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Item ID cannot be empty',
      'any.required': 'Item ID is required'
    }),

  size: Joi.string()
    .required()
    .messages({
      'string.empty': 'Size cannot be empty',
      'any.required': 'Size is required'
    })
});

export const updateCartSchema = Joi.object({
  itemId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Item ID cannot be empty',
      'any.required': 'Item ID is required'
    }),

  size: Joi.string()
    .required()
    .messages({
      'string.empty': 'Size cannot be empty',
      'any.required': 'Size is required'
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at least 0',
      'any.required': 'Quantity is required'
    })
});

export const addReviewSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Product ID cannot be empty',
      'string.pattern.base': 'Product ID must be a valid MongoDB ObjectId',
      'any.required': 'Product ID is required'
    }),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be a whole number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),

  comment: Joi.string()
    .trim()
    .min(3)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Comment cannot be empty',
      'string.min': 'Comment must be at least 3 characters',
      'string.max': 'Comment cannot exceed 1000 characters',
      'any.required': 'Comment is required'
    })
});

