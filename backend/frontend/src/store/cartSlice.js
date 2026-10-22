import { createSlice } from "@reduxjs/toolkit";
import { loadCart } from "../customer/services/cartService";

export const MAX_QUANTITY = 10;

// Cart items are stored as { id, quantity }. Full product details are looked
// up from the shared product list, so they never go out of date.
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart(state, action) {
      const { id, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      } else {
        state.items.push({ id, quantity: Math.min(quantity, MAX_QUANTITY) });
      }
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, MAX_QUANTITY));
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
