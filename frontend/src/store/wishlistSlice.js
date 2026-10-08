import { createSlice } from "@reduxjs/toolkit";
import { loadWishlist } from "../customer/services/wishlistService";

// The wishlist is just a list of product ids.
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { ids: loadWishlist() },
  reducers: {
    toggleWishlist(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((itemId) => itemId !== id)
        : [...state.ids, id];
    },
    removeFromWishlist(state, action) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
