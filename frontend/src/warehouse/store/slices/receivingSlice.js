import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInboundShipments, getBins, receiveAsn } from '../../services/receivingService';
import { fetchInventory } from './inventorySlice';
import { fetchMovements } from './movementSlice';
import { scoped } from '../guard';

export const fetchInbound = createAsyncThunk('warehouse/receiving/fetch', scoped(getInboundShipments));

export const fetchBins = createAsyncThunk('warehouse/receiving/fetchBins', scoped(getBins));

export const receiveShipment = createAsyncThunk(
  'warehouse/receiving/receive',
  async ({ warehouseId, id, bin }, { dispatch }) => {
    const result = await receiveAsn(warehouseId, id, bin);
    await Promise.all([
      dispatch(fetchInbound(warehouseId)),
      dispatch(fetchInventory(warehouseId)),
      dispatch(fetchMovements(warehouseId)),
    ]);
    return result;
  }
);

const defaultFilters = { search: '', status: 'all' };

const receivingSlice = createSlice({
  name: 'warehouse/receiving',
  initialState: {
    items: [],
    bins: {},
    status: 'idle',
    error: null,
    selectedId: null,
    filters: { ...defaultFilters },
    isReceiving: false,
    receiveError: null,
  },
  reducers: {
    selectAsn(state, action) {
      state.selectedId = action.payload;
      state.receiveError = null;
    },
    focusAsn(state, action) {
      state.selectedId = action.payload;
      state.filters = { ...defaultFilters };
      state.receiveError = null;
    },
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearReceiveError(state) {
      state.receiveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInbound.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInbound.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        if (!state.selectedId) {
          const firstPending = action.payload.find((a) => a.status === 'pending');
          const first = firstPending || action.payload[0];
          state.selectedId = first ? first.id : null;
        }
      })
      .addCase(fetchInbound.rejected, (state, action) => {
        if (action.payload?.stale) return;
        state.status = 'failed';
        state.error = action.error.message || 'Could not load shipments.';
      })
      .addCase(fetchBins.fulfilled, (state, action) => {
        state.bins = action.payload;
      })
      .addCase(receiveShipment.pending, (state) => {
        state.isReceiving = true;
        state.receiveError = null;
      })
      .addCase(receiveShipment.fulfilled, (state) => {
        state.isReceiving = false;
      })
      .addCase(receiveShipment.rejected, (state, action) => {
        state.isReceiving = false;
        state.receiveError = action.error.message || 'Could not allocate this shipment.';
      });
  },
});

export const { selectAsn, focusAsn, setFilter, clearReceiveError } = receivingSlice.actions;
export default receivingSlice.reducer;
