const { body, validationResult } = require("express-validator");
const AppError = require("../errors/AppError");

const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

const updateRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),
body("dateOfBirth")
  .optional()
  .isISO8601().withMessage("Invalid date format"),

body("gender")
  .optional()
  .isIn(["male", "female", "other"])
  .withMessage("Invalid gender"),

body("state")
  .optional()
  .isString(),

body("city")
  .optional()
  .isString(),

body("profilePic")
  .optional()
    .isString(), 
  
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];

const forgotPasswordRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
];

const resetPasswordRules = [
  body("password")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
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

module.exports = {
  registerRules,
  loginRules,
  updateRules,
  forgotPasswordRules,
  resetPasswordRules,
  validate,
};
