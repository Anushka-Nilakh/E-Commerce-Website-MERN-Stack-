import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Orders() {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (loading) {
    return (
      <main className="p-10 text-center">
        <p className="text-xl">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-10 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              {/* Order Header */}

              <div className="flex flex-col justify-between gap-4 border-b pb-4 md:flex-row">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-medium">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span className="font-semibold text-green-600">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Products */}

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹
                        {item.price.toLocaleString(
                          "en-IN"
                        )}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}

              <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <p className="font-medium">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-xl font-bold">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="rounded-lg border px-5 py-2 text-center font-medium hover:bg-gray-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;