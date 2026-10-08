import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import { saveCart } from "../customer/services/cartService";
import { saveWishlist } from "../customer/services/wishlistService";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

// Save to the browser whenever cart or wishlist changes.
let lastCart = store.getState().cart.items;
let lastWishlist = store.getState().wishlist.ids;

store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  if (cart.items !== lastCart) {
    lastCart = cart.items;
    saveCart(lastCart);
  }
  if (wishlist.ids !== lastWishlist) {
    lastWishlist = wishlist.ids;
    saveWishlist(lastWishlist);
  }
});

export default store;
