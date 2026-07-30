const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(
        (detail) => detail.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages,
      });
    }

    req[source] = value;

    next();
  };
};

export default validateRequest;