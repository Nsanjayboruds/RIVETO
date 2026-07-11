export class ApiError extends Error {
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Resource not found", errors = []) {
    return new ApiError(404, message, errors);
  }

  static internal(message = "Internal server error", errors = []) {
    return new ApiError(500, message, errors, false);
  }

  static tooManyRequests(message = "Too many requests", errors = []) {
    return new ApiError(429, message, errors);
  }
}

export const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const errors = error.errors || [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: error.timestamp || new Date().toISOString(),
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};