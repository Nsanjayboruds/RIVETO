import { ApiError, errorResponse } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error [${req.requestId || "unknown"}]:`, err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, ApiError.badRequest("Validation failed", errors));
  }

  if (err.name === "CastError") {
    return errorResponse(res, ApiError.badRequest("Invalid ID format"));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(
      res,
      ApiError.badRequest(`${field} already exists`, [
        { field, message: `${field} must be unique` },
      ])
    );
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, ApiError.unauthorized("Invalid token"));
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, ApiError.unauthorized("Token expired"));
  }

  if (err instanceof ApiError) {
    return errorResponse(res, err);
  }

  return errorResponse(res, ApiError.internal(err.message));
};

export default errorHandler;