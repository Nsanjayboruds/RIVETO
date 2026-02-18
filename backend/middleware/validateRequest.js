const validateRequest = (schema) => {
  return (req, res, next) => {
    // Check the body against the schema
    // abortEarly: false = return ALL errors, not just the first one
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Extract just the message strings from the error details
      const errorMessages = error.details.map((detail) => detail.message);
      
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages
      });
    }

    // If valid, let the request pass to the controller
    next();
  };
};

export default validateRequest;