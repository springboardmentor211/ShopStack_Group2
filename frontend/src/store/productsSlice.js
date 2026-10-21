import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "../customer/services/productService";
import { getErrorMessage } from "../shared/api/client";

// Products come from the backend (GET /products) and are shared by every page.
export const loadProducts = createAsyncThunk(
  "products/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProducts();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Could not load products."));
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null, source: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.source = action.payload.source;
        state.status = "succeeded";
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not load products.";
        state.source = null;
      });
  },
});

export default productsSlice.reducer;
