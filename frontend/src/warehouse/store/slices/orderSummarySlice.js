import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderSummary } from '../../services/dashboardService';
import { resetWarehouse, resetWarehouseData } from '../actions';

export const fetchOrderSummary = createAsyncThunk('warehouse/orderSummary/fetch', getOrderSummary);

const initialState = {
  pipeline: {},
  dueToday: 0,
  status: 'idle',
  error: null,
};

const orderSummarySlice = createSlice({
  name: 'warehouse/orderSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetWarehouse, () => initialState)
      .addCase(resetWarehouseData, () => initialState)
      .addCase(fetchOrderSummary.pending, (state) => {
        if (state.status !== 'succeeded') state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pipeline = action.payload?.pipeline || {};
        state.dueToday = action.payload?.dueToday || 0;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not load the order summary.';
      });
  },
});

export default orderSummarySlice.reducer;
