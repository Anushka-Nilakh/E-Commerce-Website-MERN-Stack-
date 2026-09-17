import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          ShopSphere
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="hover:text-gray-600"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-gray-600"
          >
            Products
          </Link>

          <Link
            to="/wishlist"
            className="hover:text-gray-600"
          >
            Wishlist ({wishlistItems.length})
          </Link>

          <Link
            to="/cart"
            className="hover:text-gray-600"
          >
            Cart ({cartCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/orders"
                className="hover:text-gray-600"
              >
                My Orders
              </Link>

              {/* Logged-in user */}

              <span className="font-medium">
                Hi, {user?.name}
              </span>

              {/* Admin link */}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="font-semibold text-purple-600"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;