import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  void next;

  logger.error(err.message, { stack: err.stack, path: req.path });

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default errorHandler;