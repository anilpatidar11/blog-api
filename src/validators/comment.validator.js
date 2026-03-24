const { body, validationResult } = require("express-validator");
const AppError = require("../errors/AppError");

const commentRules = [
  body("text")
    .trim()
    .notEmpty().withMessage("Comment text is required")
    .isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
];

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    const error = new AppError("Validation failed", 422);
    error.isValidationError = true;
    error.errors = formattedErrors;
    return next(error);
  }
  next();
};

module.exports = { commentRules, validate };
