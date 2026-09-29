const express = require("express");
const router = express.Router();
 
const {
  getDashboardStats,
  createUser,
  createStore,
  getAllUsers,
  getAllStores,
  getUserDetails,
} = require("../../controllers/admin/admin-controller.js");
 
const { verifyToken, requireRole } = require("../../controllers/auth/auth-controller");
const {
  adminCreateUserValidation,
  createStoreValidation,
} = require("../../middleware/validators");
const handleValidationErrors = require("../../middleware/handleValidationErrors");
 
// Every route below requires: logged in AND role === 'admin'
router.use(verifyToken, requireRole("admin"));
 
router.get("/dashboard", getDashboardStats);
 
router.post("/users", adminCreateUserValidation, handleValidationErrors, createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
 
router.post("/stores", createStoreValidation, handleValidationErrors, createStore);
router.get("/stores", getAllStores);
 
module.exports = router;
 
