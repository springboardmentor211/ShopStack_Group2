import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import productsReducer from "./productsSlice";
import uiReducer from "./uiSlice";
import { warehouseReducers } from "../warehouse/store/warehouseReducers";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    ui: uiReducer,
    ...warehouseReducers,
  },
});

export default store;
