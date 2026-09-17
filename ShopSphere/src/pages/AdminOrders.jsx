import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function AdminOrders() {
  const token = useSelector((state) => state.auth.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (error) {
      console.error("FETCH ADMIN ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          orderStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (error) {
      console.error("UPDATE ORDER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="text-4xl font-bold">
        Order Management
      </h1>

      <p className="mt-2 text-gray-500">
        View and manage customer orders
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >

              {/* Order Header */}

              <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">

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
                    Order Date
                  </p>

                  <p className="font-medium">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-lg font-bold">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

              </div>

              {/* Customer */}

              <div className="mt-5">
                <h3 className="text-lg font-semibold">
                  Customer
                </h3>

                <div className="mt-2 text-gray-600">
                  <p>
                    Name:{" "}
                    <span className="font-medium text-black">
                      {order.user?.name || "N/A"}
                    </span>
                  </p>

                  <p>
                    Mobile:{" "}
                    <span className="font-medium text-black">
                      {order.user?.mobile || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Products */}

              <div className="mt-6">
                <h3 className="text-lg font-semibold">
                  Products
                </h3>

                <div className="mt-3 space-y-3">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg bg-gray-50 p-3"
                    >

                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium">
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
              </div>

              {/* Shipping */}

              <div className="mt-6">
                <h3 className="text-lg font-semibold">
                  Shipping Address
                </h3>

                <div className="mt-2 text-gray-600">
                  <p>{order.shippingAddress?.fullName}</p>
                  <p>
                    {order.shippingAddress?.mobile}
                  </p>
                  <p>
                    {order.shippingAddress?.address}
                  </p>
                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} -{" "}
                    {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Payment & Status */}

              <div className="mt-6 flex flex-col gap-4 border-t pt-5 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Payment Method
                  </p>

                  <p className="font-semibold">
                    {order.paymentMethod}
                  </p>

                  <p className="text-sm text-gray-500">
                    Payment Status:{" "}
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Order Status
                  </label>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className="mt-1 block rounded-lg border px-4 py-2 font-medium"
                  >
                    <option value="Placed">
                      Placed
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}

export default AdminOrders;