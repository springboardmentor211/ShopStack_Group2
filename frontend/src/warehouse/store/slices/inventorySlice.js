import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory } from '../../services/inventoryService';
import { scoped } from '../guard';

export const fetchInventory = createAsyncThunk('warehouse/inventory/fetch', scoped(getInventory));

const emptyFilters = { search: '', category: 'all', stock: 'all', zone: 'all' };

const inventorySlice = createSlice({
  name: 'warehouse/inventory',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filters: { ...emptyFilters },
  },
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
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        if (action.payload?.stale) return;
        state.status = 'failed';
        state.error = action.error.message || 'Could not load inventory.';
      });
  },
});

export const { setFilter, applyFilters } = inventorySlice.actions;
export default inventorySlice.reducer;
