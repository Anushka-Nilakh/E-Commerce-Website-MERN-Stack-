const Review = require("../models/Review");
const Product = require("../models/Product");

// ==============================
// Add Review
// ==============================

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Product, rating and comment are required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.userId,
      rating: Number(rating),
      comment,
    });

    const allReviews = await Review.find({
  product: productId,
});

const totalRating = allReviews.reduce(
  (total, review) => total + review.rating,
  0
);

const averageRating =
  totalRating / allReviews.length;

await Product.findByIdAndUpdate(productId, {
  rating: Number(averageRating.toFixed(1)),
  reviewCount: allReviews.length,
});

    const populatedReview = await review.populate(
      "user",
      "name"
    );

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// ==============================
// Get Reviews for Product
// ==============================

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;

    const averageRating =
      reviewCount === 0
        ? 0
        : reviews.reduce(
            (total, review) => total + review.rating,
            0
          ) / reviewCount;

    res.status(200).json({
      reviews,
      reviewCount,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// ==============================
// Delete Review
// ==============================

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Only review owner can delete their review
    if (
      review.user.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own review",
      });
    }

    const productId = review.product;

await review.deleteOne();

const remainingReviews = await Review.find({
  product: productId,
});

const totalRating = remainingReviews.reduce(
  (total, review) => total + review.rating,
  0
);

const averageRating =
  remainingReviews.length === 0
    ? 0
    : totalRating / remainingReviews.length;

await Product.findByIdAndUpdate(productId, {
  rating: Number(averageRating.toFixed(1)),
  reviewCount: remainingReviews.length,
});

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};