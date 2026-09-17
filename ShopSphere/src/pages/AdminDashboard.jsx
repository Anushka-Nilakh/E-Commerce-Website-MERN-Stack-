import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome, {user?.name}
        </p>
      </div>

      {/* Dashboard Cards */}

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        {/* Products */}

        <Link
          to="/admin/products"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Products
            </h2>

            <span className="text-3xl">
              📦
            </span>
          </div>

          <p className="mt-3 text-gray-500">
            Add, edit and delete products.
          </p>

          <p className="mt-5 font-medium">
            Manage Products →
          </p>
        </Link>

        {/* Orders */}

        <Link
          to="/admin/orders"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Orders
            </h2>

            <span className="text-3xl">
              🛒
            </span>
          </div>

          <p className="mt-3 text-gray-500">
            View and manage customer orders.
          </p>

          <p className="mt-5 font-medium">
            Manage Orders →
          </p>
        </Link>

        {/* Users */}

        <Link
          to="/admin/users"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Users
            </h2>

            <span className="text-3xl">
              👥
            </span>
          </div>

          <p className="mt-3 text-gray-500">
            View and manage registered ShopSphere users.
          </p>

          <p className="mt-5 font-medium">
            Manage Users →
          </p>
        </Link>

      </div>

      {/* Quick Actions */}

      <section className="mt-12 rounded-xl border bg-gray-50 p-8">

        <h2 className="text-2xl font-semibold">
          Quick Actions
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">

          <Link
            to="/admin/products"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            + Add Product
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-100"
          >
            Manage Orders
          </Link>

          <Link
            to="/admin/users"
            className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-100"
          >
            Manage Users
          </Link>

          <Link
            to="/products"
            className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-100"
          >
            View Store
          </Link>

          <Link
            to="/orders"
            className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-100"
          >
            My Orders
          </Link>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;