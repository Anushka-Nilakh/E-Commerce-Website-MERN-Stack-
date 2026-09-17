const express = require("express");

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
  sendForgotOtp,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.put("/reset-password", resetPassword);

router.post("/send-forgot-otp", sendForgotOtp);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You can access this protected route",
    user: req.user,
  });
});

router.get("/admin-test", protect, admin, (req, res) => {
  res.status(200).json({
    message: "Welcome Admin",
    user: req.user,
  });
});

module.exports = router;