const express = require("express");

const {
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews for a product
router.get(
  "/product/:productId",
  getProductReviews
);

// Add a review
router.post(
  "/",
  protect,
  createReview
);

// Delete own review
router.delete(
  "/:id",
  protect,
  deleteReview
);

module.exports = router;