import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice"

function Cart() {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  )

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">

        <h1 className="text-4xl font-bold">
          Shopping Cart
        </h1>

        <div className="mt-10 rounded-xl border p-10 text-center">

          <p className="text-gray-500">
            Your cart is empty.
          </p>

        </div>

      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">

      <div className="flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Shopping Cart
        </h1>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500"
        >
          Clear Cart
        </button>

      </div>

      <div className="mt-10 space-y-4">

        {cartItems.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-6 rounded-xl border p-4"
          >

            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-24 rounded-lg object-cover"
            />

            <div className="flex-1">

              <h2 className="font-semibold">
                {item.name}
              </h2>

              <p className="text-gray-500">
                ₹{item.price.toLocaleString("en-IN")}
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  dispatch(decreaseQuantity(item.id))
                }
                className="rounded border px-3 py-1"
              >
                -
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  dispatch(increaseQuantity(item.id))
                }
                className="rounded border px-3 py-1"
              >
                +
              </button>

            </div>

            <p className="w-24 text-right font-semibold">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>

            <button
              onClick={() =>
                dispatch(removeFromCart(item.id))
              }
              className="text-red-500"
            >
              Remove
            </button>

          </div>

        ))}

      </div>

      <div className="mt-10 flex justify-end">

        <div className="w-full max-w-sm rounded-xl border p-6">

          <div className="flex justify-between text-lg">
            <span>Subtotal</span>

            <span className="font-bold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full cursor-pointer rounded-lg bg-black py-3 text-white hover:bg-gray-800"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </main>
  )
}

export default Cart