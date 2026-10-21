import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCustomerId, isLoggedIn } from "../customer/services/authService";
import { getErrorMessage } from "../shared/api/client";
import { showToast } from "./uiSlice";

// Makes a thunk that runs an API call for the logged-in customer.
// fn(customerId, argument, getState) must return the new data.
// On failure it shows a message to the person and rejects.
export const makeThunk = (prefix, fn) =>
  createAsyncThunk(prefix, async (arg, { dispatch, getState, rejectWithValue }) => {
    if (!isLoggedIn()) return rejectWithValue("Please sign in first.");
    try {
      return await fn(getCustomerId(), arg, getState);
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(showToast({ message, type: "error" }));
      return rejectWithValue(message);
    }
  });
