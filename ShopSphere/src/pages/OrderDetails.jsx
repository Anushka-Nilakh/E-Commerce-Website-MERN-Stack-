import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <main className="p-10 text-center">
        <p className="text-xl">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl text-red-500">
          {error || "Order not found"}
        </h1>

        <Link
          to="/orders"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Back to Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold">
            Order Details
          </h1>

          <p className="mt-2 text-gray-500">
            Order ID: {order._id}
          </p>
        </div>

        <Link
          to="/orders"
          className="rounded-lg border px-5 py-2 text-center hover:bg-gray-100"
        >
          ← My Orders
        </Link>
      </div>

      {/* Order Status */}

      <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Order Status
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Current Status
            </p>

            <p className="mt-1 font-semibold text-green-600">
              {order.orderStatus}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Payment
            </p>

            <p className="mt-1 font-semibold">
              {order.paymentMethod} -{" "}
              {order.paymentStatus}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Order Date
            </p>

            <p className="mt-1 font-semibold">
              {new Date(
                order.createdAt
              ).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Products */}

        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold">
            Ordered Products
          </h2>

          <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-gray-500">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </p>

                    <p className="mt-2 font-semibold">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t pt-6 text-xl font-bold">
              <span>Total</span>

              <span>
                ₹
                {order.totalAmount.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Shipping Address */}

        <section>
          <h2 className="text-2xl font-semibold">
            Shipping Address
          </h2>

          <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
            <p className="font-semibold">
              {order.shippingAddress.fullName}
            </p>

            <p className="mt-3 text-gray-600">
              {order.shippingAddress.address}
            </p>

            <p className="mt-2 text-gray-600">
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}
            </p>

            <p className="mt-2 text-gray-600">
              PIN: {order.shippingAddress.pincode}
            </p>

            <p className="mt-4 border-t pt-4 text-gray-600">
              Mobile: {order.shippingAddress.mobile}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default OrderDetails;