import { createSlice } from "@reduxjs/toolkit";

// A small message shown at the bottom of the screen (errors and confirmations).
const uiSlice = createSlice({
  name: "ui",
  initialState: { toast: null },
  reducers: {
    showToast(state, action) {
      state.toast = {
        id: Date.now() + Math.random(),
        message: action.payload.message,
        type: action.payload.type || "info",
      };
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
