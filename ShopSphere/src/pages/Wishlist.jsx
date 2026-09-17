import { useSelector } from "react-redux";

import ProductCard from "../components/ProductCard";

function Wishlist() {

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <h1 className="text-4xl font-bold">
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (

        <div className="mt-10 rounded-xl border p-10 text-center">
          <p className="text-gray-500">
            Your wishlist is empty.
          </p>
        </div>

      ) : (

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      )}

    </main>
  );
}

export default Wishlist;