import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { addToCart } from "../store/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

const currentUserId = useSelector(
  (state) => state.auth.user?.id
);

  const [product, setProduct] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  // ==============================
  // Fetch Product
  // ==============================

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      setProduct(response.data);
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Fetch Reviews
  // ==============================

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/product/${id}`
      );

      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setReviewCount(response.data.reviewCount);
    } catch (error) {
      console.error("FETCH REVIEWS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // ==============================
  // Add To Cart
  // ==============================

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );
  };

  // ==============================
  // Submit Review
  // ==============================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewError("");
    setReviewMessage("");

    if (!isAuthenticated) {
      setReviewError(
        "Please login to write a review"
      );
      return;
    }

    if (!comment.trim()) {
      setReviewError(
        "Please write a review comment"
      );
      return;
    }

    try {
      setReviewLoading(true);

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          productId: id,
          rating: Number(rating),
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment("");
      setRating(5);

      setReviewMessage(
        "Review added successfully!"
      );

      await fetchReviews();
    } catch (error) {
      console.error("ADD REVIEW ERROR:", error);

      setReviewError(
        error.response?.data?.message ||
          "Failed to add review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // ==============================
  // Delete Review
  // ==============================

  const handleDeleteReview = async (reviewId) => {
    try {
      setReviewError("");
      setReviewMessage("");

      await axios.delete(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewMessage(
        "Review deleted successfully"
      );

      await fetchReviews();
    } catch (error) {
      console.error("DELETE REVIEW ERROR:", error);

      setReviewError(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    );
  }

  // ==============================
  // Product Not Found
  // ==============================

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-red-500">
          {error || "Product not found"}
        </p>
      </main>
    );
  }

  // ==============================
  // Product Details
  // ==============================

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Product */}

      <div className="grid gap-10 md:grid-cols-2">

        {/* Image */}

        <div className="overflow-hidden rounded-xl border bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-[500px] w-full object-cover"
          />
        </div>

        {/* Information */}

        <div>

          <p className="text-sm font-medium text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {product.name}
          </h1>

          {/* Rating */}

          <div className="mt-4 flex items-center gap-2">

            <span className="text-xl">
              ⭐
            </span>

            <span className="font-semibold">
              {averageRating > 0
                ? averageRating
                : "No ratings"}
            </span>

            {reviewCount > 0 && (
              <span className="text-gray-500">
                ({reviewCount} reviews)
              </span>
            )}

          </div>

          <p className="mt-6 text-3xl font-bold">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Stock available:{" "}
            <span className="font-semibold text-black">
              {product.stock}
            </span>
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-8 rounded-lg bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

        </div>

      </div>

      {/* Reviews */}

      <section className="mt-16">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Customer Reviews
            </h2>

            <p className="mt-2 text-gray-500">
              {reviewCount > 0
                ? `${averageRating}/5 based on ${reviewCount} review${reviewCount > 1 ? "s" : ""}`
                : "No reviews yet"}
            </p>
          </div>

        </div>

        {/* Review Form */}

        {isAuthenticated ? (
          <div className="mt-8 rounded-xl border bg-gray-50 p-6">

            <h3 className="text-xl font-semibold">
              Write a Review
            </h3>

            {reviewError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
                {reviewError}
              </p>
            )}

            {reviewMessage && (
              <p className="mt-4 rounded-lg bg-green-50 p-3 text-green-600">
                {reviewMessage}
              </p>
            )}

            <form
              onSubmit={handleSubmitReview}
              className="mt-5"
            >

              <label className="block text-sm font-medium">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value)
                }
                className="mt-2 rounded-lg border bg-white px-4 py-2"
              >
                <option value="5">
                  ⭐⭐⭐⭐⭐ — 5
                </option>

                <option value="4">
                  ⭐⭐⭐⭐ — 4
                </option>

                <option value="3">
                  ⭐⭐⭐ — 3
                </option>

                <option value="2">
                  ⭐⭐ — 2
                </option>

                <option value="1">
                  ⭐ — 1
                </option>
              </select>

              <label className="mt-5 block text-sm font-medium">
                Your Review
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Share your experience with this product..."
                rows="4"
                maxLength="500"
                className="mt-2 w-full rounded-lg border bg-white px-4 py-3"
              />

              <p className="mt-1 text-right text-xs text-gray-500">
                {comment.length}/500
              </p>

              <button
                type="submit"
                disabled={reviewLoading}
                className="mt-3 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-gray-50 p-6">
            <p className="text-gray-600">
              Please login to write a review.
            </p>
          </div>
        )}

        {/* Review List */}

        <div className="mt-8 space-y-5">

          {reviews.length === 0 ? (
            <div className="rounded-xl border p-8 text-center">
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            reviews.map((review) => {

              

              const reviewUserId =
                review.user?._id;

              const isReviewOwner =
                currentUserId &&
                reviewUserId &&
                currentUserId === reviewUserId;

              return (
                <div
                  key={review._id}
                  className="rounded-xl border bg-white p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="font-semibold">
                        {review.user?.name ||
                          "User"}
                      </p>

                      <div className="mt-1">
                        {"⭐".repeat(review.rating)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <p className="mt-4 text-gray-600">
                    {review.comment}
                  </p>

                  {isReviewOwner && (
                    <button
                      onClick={() =>
                        handleDeleteReview(
                          review._id
                        )
                      }
                      className="mt-4 text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Delete Review
                    </button>
                  )}

                </div>
              );
            })
          )}

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;