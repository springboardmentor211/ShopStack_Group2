import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { getCurrentWarehouseProfile } from '../../services/authService';
import { fetchInventory } from './inventorySlice';
import { fetchInbound, fetchBins } from './receivingSlice';
import { fetchMovements } from './movementSlice';
import { fetchOrderSummary } from './orderSummarySlice';
import { resetWarehouse, resetWarehouseData } from '../actions';

export const fetchWarehouseProfile = createAsyncThunk('warehouse/core/profile', getCurrentWarehouseProfile);

export const loadWarehouseData = createAsyncThunk('warehouse/core/loadData', async (warehouseId, { dispatch }) => {
  await Promise.all([
    dispatch(fetchInventory(warehouseId)),
    dispatch(fetchInbound(warehouseId)),
    dispatch(fetchBins(warehouseId)),
    dispatch(fetchMovements(warehouseId)),
    dispatch(fetchOrderSummary(warehouseId)),
  ]);
});

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
  lastSyncedAt: null,
  loaded: false,
};

const warehouseSlice = createSlice({
  name: 'warehouse/core',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetWarehouse, () => initialState)
      .addCase(resetWarehouseData, (state) => {
        state.lastSyncedAt = null;
        state.loaded = false;
      })
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
      .addCase(loadWarehouseData.fulfilled, (state, action) => {
        if (action.meta.arg === state.profile?.warehouseId) state.loaded = true;
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
