const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  if (err.message === "Email already exists") {
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Invalid email or password" || err.message === "Invalid credentials") {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;