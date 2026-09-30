import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { getCurrentWarehouseProfile } from '../../services/authService';
import { fetchInventory } from './inventorySlice';
import { fetchInbound, fetchBins } from './receivingSlice';
import { fetchMovements } from './movementSlice';
import { fetchOrderSummary } from './orderSummarySlice';

export const fetchWarehouseProfile = createAsyncThunk('warehouse/core/profile', async () => {
  return getCurrentWarehouseProfile();
});

export const loadWarehouseData = createAsyncThunk('warehouse/core/loadData', async (warehouseId, { dispatch }) => {
  await Promise.all([
    dispatch(fetchInventory(warehouseId)),
    dispatch(fetchInbound(warehouseId)),
    dispatch(fetchBins(warehouseId)),
    dispatch(fetchMovements(warehouseId)),
    dispatch(fetchOrderSummary(warehouseId)),
  ]);
});

const warehouseSlice = createSlice({
  name: 'warehouse/core',
  initialState: {
    profile: null,
    status: 'idle',
    error: null,
    lastSyncedAt: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWarehouseProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchWarehouseProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not load the warehouse profile.';
      })
      .addMatcher(
        isAnyOf(fetchInventory.fulfilled, fetchInbound.fulfilled, fetchMovements.fulfilled, fetchOrderSummary.fulfilled),
        (state) => {
          state.lastSyncedAt = new Date().toISOString();
        }
      );
  },
});

export default warehouseSlice.reducer;
