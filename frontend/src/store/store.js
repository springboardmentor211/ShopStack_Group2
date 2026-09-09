import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.js';
import wishlistReducer from './wishlistSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
