import { Link } from "react-router-dom";

function OrderSuccess() {

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">

      <div className="w-full max-w-lg text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-6 text-4xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-500">
          Thank you for shopping with ShopSphere.
          Your order has been received.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            to="/products"
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="rounded-lg border px-6 py-3"
          >
            View Orders
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;