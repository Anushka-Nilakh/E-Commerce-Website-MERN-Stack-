import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

const savedCart = localStorage.getItem("cart");
const savedWishlist = localStorage.getItem("wishlist");
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },

  preloadedState: {
    cart: savedCart
      ? JSON.parse(savedCart)
      : undefined,

    wishlist: savedWishlist
      ? JSON.parse(savedWishlist)
      : undefined,
  },
});

store.subscribe(() => {

  const state = store.getState();

  localStorage.setItem(
    "cart",
    JSON.stringify(state.cart)
  );

  localStorage.setItem(
    "wishlist",
    JSON.stringify(state.wishlist)
  );

});