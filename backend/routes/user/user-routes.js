const express = require("express");
const router = express.Router();
const { getStores, submitRating } = require("../../controllers/user/user-controller");
const { verifyToken, requireRole } = require("../../controllers/auth/auth-controller");
const { ratingValidation } = require("../../middleware/validators");
const handleValidationErrors = require("../../middleware/handleValidationErrors");

router.use(verifyToken, requireRole("normal"));

router.get("/stores", getStores);
router.post("/stores/:storeId/rating", ratingValidation, handleValidationErrors, submitRating);

module.exports = router;
