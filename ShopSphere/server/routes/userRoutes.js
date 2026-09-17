const express = require("express");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin: Get all users
router.get("/", protect, admin, getAllUsers);

// Admin: Update user role
router.put("/:id/role", protect, admin, updateUserRole);

module.exports = router;