const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }

    next();
  };
};

export default authorizeRoles;