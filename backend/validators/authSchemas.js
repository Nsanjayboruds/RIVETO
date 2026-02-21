import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 3 characters',
      'any.required': 'Name is a required field'
    }),
    
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is a required field'
    }),

  // FIX: Updated min length to 8 to match controller
  password: Joi.string()
    .min(8) 
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is a required field'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is a required field'
    }),

  password: Joi.string()
    .min(8)
    .required()
});