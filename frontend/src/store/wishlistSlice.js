import { createSlice } from "@reduxjs/toolkit";
<<<<<<< HEAD
import {
  fetchWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../customer/services/wishlistService";
import { makeThunk } from "./thunkHelper";

// The wishlist is a list of product ids, saved in the database.
export const loadWishlist = makeThunk("wishlist/load", (customerId) =>
  fetchWishlist(customerId)
);

export const addToWishlist = makeThunk(
  "wishlist/add",
  async (customerId, productId, getState) => {
    try {
      await addWishlistItem(customerId, productId);
    } catch (error) {
      // Already saved earlier: that is fine, just show it as saved.
      if (!/already/i.test(error.response?.data?.message || "")) throw error;
    }
    return [...new Set([...getState().wishlist.ids, productId])];
  }
);

export const removeFromWishlist = makeThunk(
  "wishlist/remove",
  async (customerId, productId, getState) => {
    await removeWishlistItem(customerId, productId);
    return getState().wishlist.ids.filter((id) => id !== productId);
  }
);

// Heart button: add if not saved yet, remove if already saved.
export const toggleWishlist = (productId) => (dispatch, getState) =>
  dispatch(
    getState().wishlist.ids.includes(productId)
      ? removeFromWishlist(productId)
      : addToWishlist(productId)
  );

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { ids: [], status: "idle" },
  reducers: {
    resetWishlist(state) {
      state.ids = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    for (const thunk of [loadWishlist, addToWishlist, removeFromWishlist]) {
      builder
        .addCase(thunk.fulfilled, (state, action) => {
          state.ids = action.payload;
          state.status = "succeeded";
        })
        .addCase(thunk.rejected, (state) => {
          state.status = "failed";
        });
    }
  },
});

export const { resetWishlist } = wishlistSlice.actions;
=======
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
>>>>>>> origin/warehouse-module
export default wishlistSlice.reducer;
