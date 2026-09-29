const express = require("express");
const router = express.Router();
const { getDashboard } = require("../../controllers/store_owner/store_owner-controller.js");
const { verifyToken, requireRole } = require("../../controllers/auth/auth-controller");

router.use(verifyToken, requireRole("store_owner"));

router.get("/dashboard", getDashboard);

module.exports = router;
