import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  rating: "",
};

function AdminProducts() {
  const token = useSelector((state) => state.auth.token);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: Number(form.rating),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productData,
          config
        );

        setMessage("Product updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          productData,
          config
        );

        setMessage("Product added successfully");
      }

      setForm(initialForm);
      setEditingId(null);

      await fetchProducts();
    } catch (error) {
  console.error("PRODUCT ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("BACKEND RESPONSE:", error.response?.data);

  setError(
    error.response?.data?.error ||
      error.response?.data?.message ||
      "Operation failed"
  );
} finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      rating: product.rating,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product deleted successfully");

      await fetchProducts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="text-4xl font-bold">
        Product Management
      </h1>

      <p className="mt-2 text-gray-500">
        Add, edit and manage ShopSphere products
      </p>

      {/* Messages */}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-6 rounded-lg bg-green-50 p-4 text-green-600">
          {message}
        </p>
      )}

      {/* Product Form */}

      <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-semibold">
          {editingId
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            min="0"
            required
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            min="0"
            required
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="rating"
            type="number"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating (0-5)"
            min="0"
            max="5"
            step="0.1"
            required
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="rounded-lg border px-4 py-3"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            rows="4"
            required
            className="md:col-span-2 rounded-lg border px-4 py-3"
          />

          <div className="flex gap-3 md:col-span-2">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </section>

      {/* Product List */}

      <section className="mt-10">

        <h2 className="text-2xl font-semibold">
          Products ({products.length})
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">

                <p className="text-sm text-gray-500">
                  {product.category}
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 font-bold">
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>

                <div className="mt-4 flex gap-2">

                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 rounded-lg border py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="flex-1 rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}

export default AdminProducts;