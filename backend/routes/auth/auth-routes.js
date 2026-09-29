const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  verifyToken,
} = require("../../controllers/auth/auth-controller.js");
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} = require("../../middleware/validators");
const handleValidationErrors = require("../../middleware/handleValidationErrors");

const router = express.Router();

router.post("/register", registerValidation, handleValidationErrors, registerUser);
router.post("/login", loginValidation, handleValidationErrors, loginUser);
router.post("/logout", logoutUser);

// Protected — returns the decoded token payload for whoever is calling.
// Used on page refresh so the frontend can confirm the token is still valid.
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Any logged-in role can change their own password.
router.put("/password", verifyToken, updatePasswordValidation, handleValidationErrors, updatePassword);

module.exports = router;
