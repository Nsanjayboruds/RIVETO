import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string().trim().min(3).max(30).required(),
  discountType: Joi.string().valid("percentage", "flat").required(),
  discountValue: Joi.number().positive().required(),
  expiryDate: Joi.date().greater("now").required(),
  usageLimit: Joi.number().integer().positive().allow(null).default(null),
  minOrderAmount: Joi.number().min(0).default(0),
  isActive: Joi.boolean().default(true),
}).custom((value, helpers) => {
  if (value.discountType === "percentage" && value.discountValue > 100) {
    return helpers.error("any.invalid", { message: "Percentage discount cannot exceed 100" });
  }
  return value;
}, "percentage discount validation");

export const updateCouponSchema = Joi.object({
  discountType: Joi.string().valid("percentage", "flat"),
  discountValue: Joi.number().positive(),
  expiryDate: Joi.date().greater("now"),
  usageLimit: Joi.number().integer().positive().allow(null),
  minOrderAmount: Joi.number().min(0),
  isActive: Joi.boolean(),
}).min(1);

export const couponIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});

export const validateCouponSchema = Joi.object({
  code: Joi.string().trim().required(),
  subtotal: Joi.number().positive().required(),
});
