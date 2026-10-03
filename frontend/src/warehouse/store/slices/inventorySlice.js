import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory } from '../../services/inventoryService';
import { resetWarehouse, resetWarehouseData } from '../actions';

export const fetchInventory = createAsyncThunk('warehouse/inventory/fetch', getInventory);

const emptyFilters = { search: '', category: 'all', stock: 'all', zone: 'all' };

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filters: { ...emptyFilters },
};

const inventorySlice = createSlice({
  name: 'warehouse/inventory',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    applyFilters(state, action) {
      state.filters = { ...emptyFilters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetWarehouse, () => initialState)
      .addCase(resetWarehouseData, () => initialState)
      .addCase(fetchInventory.pending, (state) => {
        if (state.status !== 'succeeded') state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not load inventory.';
      });
  },
});

export const { setFilter, applyFilters } = inventorySlice.actions;
export default inventorySlice.reducer;
