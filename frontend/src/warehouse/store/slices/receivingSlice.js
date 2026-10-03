import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInboundShipments, getBins, receiveAsn } from '../../services/receivingService';
import { fetchInventory } from './inventorySlice';
import { fetchMovements } from './movementSlice';
import { resetWarehouse, resetWarehouseData } from '../actions';

export const fetchInbound = createAsyncThunk('warehouse/receiving/fetch', getInboundShipments);

export const fetchBins = createAsyncThunk('warehouse/receiving/fetchBins', getBins);

export const receiveShipment = createAsyncThunk(
  'warehouse/receiving/receive',
  async ({ warehouseId, id, bin }, { dispatch }) => {
    try {
      return await receiveAsn(warehouseId, id, bin);
    } finally {
      await Promise.all([
        dispatch(fetchInbound(warehouseId)),
        dispatch(fetchInventory(warehouseId)),
        dispatch(fetchMovements(warehouseId)),
      ]);
    }
  }
);

const defaultFilters = { search: '', status: 'all' };

const initialState = {
  items: [],
  bins: {},
  binsStatus: 'idle',
  status: 'idle',
  error: null,
  selectedId: null,
  filters: { ...defaultFilters },
  isReceiving: false,
  receiveError: null,
};

const receivingSlice = createSlice({
  name: 'warehouse/receiving',
  initialState,
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
      .addCase(resetWarehouse, () => initialState)
      .addCase(resetWarehouseData, () => initialState)
      .addCase(fetchInbound.pending, (state) => {
        if (state.status !== 'succeeded') state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInbound.fulfilled, (state, action) => {
        const list = [...(action.payload || [])].sort((a, b) => {
          const pendingFirst = Number(b.status === 'pending') - Number(a.status === 'pending');
          if (pendingFirst !== 0) return pendingFirst;
          return (Date.parse(b.arrivedAt) || 0) - (Date.parse(a.arrivedAt) || 0);
        });
        state.status = 'succeeded';
        state.items = list;
        if (!state.selectedId) {
          const firstPending = list.find((a) => a.status === 'pending');
          const first = firstPending || list[0];
          state.selectedId = first ? first.id : null;
        }
      })
      .addCase(fetchInbound.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Could not load shipments.';
      })
      .addCase(fetchBins.pending, (state) => {
        if (state.binsStatus !== 'succeeded') state.binsStatus = 'loading';
      })
      .addCase(fetchBins.fulfilled, (state, action) => {
        state.binsStatus = 'succeeded';
        state.bins = action.payload || {};
      })
      .addCase(fetchBins.rejected, (state) => {
        state.binsStatus = 'failed';
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
