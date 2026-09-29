const { body, param } = require("express-validator");

// ---- Reusable field rules (match the assignment's validation spec) ----
const nameRule = () =>
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters");

const emailRule = () =>
  body("email").trim().isEmail().withMessage("Please enter a valid email");

const addressRule = () =>
  body("address")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters");

const passwordRule = (field = "password") =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must include at least one special character");

// ---- Validation chains per endpoint ----
const registerValidation = [nameRule(), emailRule(), addressRule(), passwordRule()];

const loginValidation = [
  emailRule(),
  body("password").notEmpty().withMessage("Password is required"),
];

const updatePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("Current password is required"),
  passwordRule("newPassword"),
];

const adminCreateUserValidation = [
  nameRule(),
  emailRule(),
  addressRule(),
  passwordRule(),
  body("role")
    .optional()
    .isIn(["admin", "normal", "store_owner"])
    .withMessage("Role must be admin, normal or store_owner"),
];

const createStoreValidation = [
  nameRule(),
  emailRule(),
  addressRule(),
  body("ownerId")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("ownerId must be a valid user id"),
];

const ratingValidation = [
  param("storeId").isInt({ min: 1 }).withMessage("Invalid store id"),
  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5"),
];

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  adminCreateUserValidation,
  createStoreValidation,
  ratingValidation,
};
