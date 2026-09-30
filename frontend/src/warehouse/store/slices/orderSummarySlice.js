import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderSummary } from '../../services/dashboardService';
import { scoped } from '../guard';

export const fetchOrderSummary = createAsyncThunk('warehouse/orderSummary/fetch', scoped(getOrderSummary));

const orderSummarySlice = createSlice({
  name: 'warehouse/orderSummary',
  initialState: {
    pipeline: {},
    dueToday: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pipeline = action.payload.pipeline;
        state.dueToday = action.payload.dueToday;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        if (action.payload?.stale) return;
        state.status = 'failed';
        state.error = action.error.message || 'Could not load the order summary.';
      });
  },
});

export default orderSummarySlice.reducer;
