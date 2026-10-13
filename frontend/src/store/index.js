import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
<<<<<<< HEAD
import productsReducer from "./productsSlice";
import uiReducer from "./uiSlice";
=======
import { warehouseReducers } from "../warehouse/store/warehouseReducers";
import { saveCart } from "../customer/services/cartService";
import { saveWishlist } from "../customer/services/wishlistService";
>>>>>>> origin/warehouse-module

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
<<<<<<< HEAD
    products: productsReducer,
    ui: uiReducer,
  },
});

=======
    ...warehouseReducers,
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

>>>>>>> origin/warehouse-module
export default store;
