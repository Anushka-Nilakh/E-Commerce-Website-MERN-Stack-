import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { toggleWishlist } from "../store/wishlistSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const isWishlisted = wishlistItems.some(
    (item) => item._id === product._id
  );

  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}

      <div className="relative overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Wishlist */}

        <button
          onClick={() =>
            dispatch(toggleWishlist(product))
          }
          className="absolute right-3 top-3 cursor-pointer rounded-full bg-white px-3 py-2 text-xl shadow"
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? "❤️" : "♡"}
        </button>

      </div>

      {/* Product Information */}

      <div className="p-4">

        <p className="text-sm text-gray-500">
          {product.category}
        </p>

        <h2 className="mt-1 text-lg font-semibold">
          {product.name}
        </h2>

        {/* Rating */}

        <div className="mt-2 flex items-center gap-2">

          <span className="text-sm">
            ⭐ {product.rating > 0 ? product.rating : "No rating"}
          </span>

          {product.reviewCount > 0 && (
            <span className="text-sm text-gray-500">
              ({product.reviewCount}{" "}
              {product.reviewCount === 1
                ? "review"
                : "reviews"})
            </span>
          )}

        </div>

        {/* Price */}

        <p className="mt-2 text-xl font-bold">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* View Product */}

        <Link
          to={`/products/${product._id}`}
          className="mt-4 block rounded-lg bg-black py-2 text-center text-white transition hover:bg-gray-800"
        >
          View Product
        </Link>

      </div>

    </div>
  );
}

export default ProductCard;