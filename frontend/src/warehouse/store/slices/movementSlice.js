import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovements } from '../../services/movementService';
import { resetWarehouse, resetWarehouseData } from '../actions';

export const fetchMovements = createAsyncThunk('warehouse/movement/fetch', getMovements);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const movementSlice = createSlice({
  name: 'warehouse/movement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetWarehouse, () => initialState)
      .addCase(resetWarehouseData, () => initialState)
      .addCase(fetchMovements.pending, (state) => {
        if (state.status !== 'succeeded') state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...(action.payload || [])].sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0));
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not load stock movements.';
      });
  },
});

export default movementSlice.reducer;
