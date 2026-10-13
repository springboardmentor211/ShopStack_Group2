import { createSlice } from "@reduxjs/toolkit";
<<<<<<< HEAD
import {
  fetchCart,
  addCartItem,
  removeCartItem,
  setCartItemQuantity,
} from "../customer/services/cartService";
import { makeThunk } from "./thunkHelper";

export const MAX_QUANTITY = 10;

// Cart items are { id (product id), quantity, name, unitPrice, imageUrl }.
// The cart lives in the database; this is the copy shown on screen.
export const loadCart = makeThunk("cart/load", (customerId) => fetchCart(customerId));

export const addToCart = makeThunk(
  "cart/add",
  (customerId, { id, quantity = 1 }, getState) => {
    const existing = getState().cart.items.find((item) => item.id === id);
    const allowed = MAX_QUANTITY - (existing ? existing.quantity : 0);
    if (allowed <= 0) {
      throw new Error(`You can add at most ${MAX_QUANTITY} of one item.`);
    }
    return addCartItem(customerId, id, Math.min(quantity, allowed));
  }
);

export const setQuantity = makeThunk(
  "cart/setQuantity",
  (customerId, { id, quantity }, getState) => {
    const items = getState().cart.items;
    const existing = items.find((item) => item.id === id);
    const wanted = Math.max(1, Math.min(quantity, MAX_QUANTITY));
    if (!existing || existing.quantity === wanted) return { items };
    return setCartItemQuantity(customerId, id, existing.quantity, wanted);
  }
);

export const removeFromCart = makeThunk("cart/remove", (customerId, id) =>
  removeCartItem(customerId, id)
);

export const clearCart = makeThunk("cart/clear", async (customerId, _arg, getState) => {
  let cart = { items: [] };
  for (const item of getState().cart.items) {
    cart = await removeCartItem(customerId, item.id);
  }
  return cart;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle" },
  reducers: {
    // Called on logout so the next person does not see this cart.
    resetCart(state) {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    for (const thunk of [loadCart, addToCart, setQuantity, removeFromCart, clearCart]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = "loading";
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.items = action.payload.items;
          state.status = "succeeded";
        })
        .addCase(thunk.rejected, (state) => {
          state.status = "failed";
        });
    }
  },
});

export const { resetCart } = cartSlice.actions;
=======
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
>>>>>>> origin/warehouse-module
export default cartSlice.reducer;
