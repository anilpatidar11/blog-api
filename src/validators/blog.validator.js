const { body, validationResult } = require("express-validator");
const AppError = require("../errors/AppError");

const createBlogRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3–150 characters"),

  body("content")
    .trim()
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),
];

const updateBlogRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage("Title must be 3–150 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),
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

module.exports = { createBlogRules, updateBlogRules, validate };
