import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCart } from "../store/cartSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // CREATE SHOPSPHERE ORDER
  // ==========================================

  const createShopSphereOrder = async (paymentDetails = {}) => {
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const response = await axios.post(
      "http://localhost:5000/api/orders",
      {
        items: orderItems,
        shippingAddress: formData,
        paymentMethod,
        totalAmount,

        // Razorpay details
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.order;
  };

  // ==========================================
  // ONLINE PAYMENT
  // ==========================================

  const handleOnlinePayment = async () => {
    try {
      setError("");
      setLoading(true);

      // --------------------------------------
      // STEP 1: CREATE RAZORPAY ORDER
      // --------------------------------------

      const response = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const razorpayOrder = response.data.order;

      console.log("Razorpay Order Created:", razorpayOrder);

      // --------------------------------------
      // STEP 2: OPEN RAZORPAY CHECKOUT
      // --------------------------------------

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "ShopSphere",

        description: "ShopSphere Order",

        order_id: razorpayOrder.id,

        prefill: {
          name: formData.fullName || user?.name || "",
          contact: formData.mobile || user?.mobile || "",
        },

        theme: {
          color: "#000000",
        },

        // --------------------------------------
        // STEP 3: PAYMENT SUCCESS
        // --------------------------------------

        handler: async function (paymentResponse) {
          try {
            setLoading(true);

            console.log(
              "Razorpay Payment Response:",
              paymentResponse
            );

            // --------------------------------------
            // STEP 4: VERIFY PAYMENT ON BACKEND
            // --------------------------------------

            const verificationResponse = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(
              "Payment Verification Response:",
              verificationResponse.data
            );

            // --------------------------------------
            // STEP 5: CREATE SHOPSPHERE ORDER
            // --------------------------------------

            const order = await createShopSphereOrder({
              razorpayOrderId:
                paymentResponse.razorpay_order_id,

              razorpayPaymentId:
                paymentResponse.razorpay_payment_id,
            });

            console.log(
              "ShopSphere Order Created:",
              order
            );

            // --------------------------------------
            // STEP 6: CLEAR CART
            // --------------------------------------

            dispatch(clearCart());

            // --------------------------------------
            // STEP 7: GO TO SUCCESS PAGE
            // --------------------------------------

            navigate("/order-success", {
              state: {
                order,
                paymentId:
                  paymentResponse.razorpay_payment_id,
              },
            });

          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION / ORDER ERROR:",
              error
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed. Order was not created."
            );

          } finally {
            setLoading(false);
          }
        },

        // --------------------------------------
        // PAYMENT WINDOW CLOSED
        // --------------------------------------

        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment was cancelled.");
          },
        },
      };

      // --------------------------------------
      // STEP 8: CREATE RAZORPAY CHECKOUT
      // --------------------------------------

      if (!window.Razorpay) {
        setError(
          "Razorpay Checkout failed to load. Please refresh the page."
        );
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);

      // --------------------------------------
      // PAYMENT FAILED
      // --------------------------------------

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      // Open Razorpay
      razorpay.open();

    } catch (error) {
      console.error(
        "RAZORPAY ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to start online payment."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    // User must be logged in
    if (!token) {
      navigate("/login");
      return;
    }

    // Cart must not be empty
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // COD
      // ======================================

      if (paymentMethod === "COD") {
        const order = await createShopSphereOrder();

        console.log(
          "COD Order Created:",
          order
        );

        dispatch(clearCart());

        navigate("/order-success", {
          state: {
            order,
          },
        });

        return;
      }

      // ======================================
      // ONLINE PAYMENT
      // ======================================

      if (paymentMethod === "ONLINE") {
        await handleOnlinePayment();
      }

    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">

        <h1 className="text-3xl font-bold">
          Your cart is empty
        </h1>

        <button
          onClick={() => navigate("/products")}
          className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </button>

      </main>
    );
  }

  // ==========================================
  // CHECKOUT UI
  // ==========================================

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">

      <h1 className="text-4xl font-bold">
        Checkout
      </h1>

      {/* Error Message */}

      {error && (
        <p className="mt-6 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </p>
      )}

      <form
        onSubmit={handlePlaceOrder}
        className="mt-10 grid gap-10 md:grid-cols-2"
      >

        {/* =====================================
            SHIPPING ADDRESS
        ====================================== */}

        <section>

          <h2 className="text-2xl font-semibold">
            Shipping Address
          </h2>

          <div className="mt-6 space-y-4">

            {/* Full Name */}

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Mobile */}

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Address */}

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="4"
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* City */}

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* State */}

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

            {/* Pincode */}

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength={6}
              required
              className="w-full rounded-lg border px-4 py-3"
            />

          </div>

        </section>

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <section>

          <h2 className="text-2xl font-semibold">
            Order Summary
          </h2>

          <div className="mt-6 rounded-xl border p-6">

            {/* Products */}

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >

                <div>

                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹
                    {item.price.toLocaleString("en-IN")}
                    {" × "}
                    {item.quantity}
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

            {/* =================================
                PAYMENT METHOD
            ================================== */}

            <div className="mt-6">

              <h3 className="font-semibold">
                Payment Method
              </h3>

              <div className="mt-4 space-y-3">

                {/* COD */}

                <label className="flex items-center gap-3">

                  <input
                    type="radio"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Cash on Delivery

                </label>

                {/* Online */}

                <label className="flex items-center gap-3">

                  <input
                    type="radio"
                    value="ONLINE"
                    checked={
                      paymentMethod === "ONLINE"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Online Payment

                </label>

              </div>

            </div>

            {/* =================================
                TOTAL
            ================================== */}

            <div className="mt-6 flex justify-between border-t pt-6 text-xl font-bold">

              <span>
                Total
              </span>

              <span>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* =================================
                PLACE ORDER BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? paymentMethod === "ONLINE"
                  ? "Processing Payment..."
                  : "Placing Order..."
                : paymentMethod === "ONLINE"
                ? "Pay Now"
                : "Place Order"}
            </button>

          </div>

        </section>

      </form>

    </main>
  );
}

export default Checkout;