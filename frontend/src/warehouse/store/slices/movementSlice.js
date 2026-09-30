import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovements } from '../../services/movementService';
import { scoped } from '../guard';

export const fetchMovements = createAsyncThunk('warehouse/movement/fetch', scoped(getMovements));

const movementSlice = createSlice({
  name: 'warehouse/movement',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        if (action.payload?.stale) return;
        state.status = 'failed';
        state.error = action.error.message || 'Could not load stock movements.';
      });
  },
});

export default movementSlice.reducer;
