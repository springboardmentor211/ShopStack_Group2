import { createSlice } from '@reduxjs/toolkit';
import { resetWarehouse } from '../actions';
import { USE_MOCK } from '../../services/config';

const STORAGE_KEY = 'shopstack.warehouse-seen.v1';

function load() {
  if (USE_MOCK) return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persist(state) {
  if (USE_MOCK) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

const seenSlice = createSlice({
  name: 'warehouse/seen',
  initialState: load(),
  reducers: {
    initSeen(state, action) {
      const { warehouseId, id } = action.payload;
      const entry = state[warehouseId];
      if (!entry) {
        state[warehouseId] = { inventory: id, movement: id };
        persist(state);
        return;
      }
      let changed = false;
      ['inventory', 'movement'].forEach((page) => {
        if ((entry[page] ?? 0) > id) {
          entry[page] = id;
          changed = true;
        }
      });
      if (changed) persist(state);
    },
    markSeen(state, action) {
      const { warehouseId, page, id } = action.payload;
      const entry = state[warehouseId] || { inventory: id, movement: id };
      if (id <= (entry[page] ?? 0)) return;
      entry[page] = id;
      state[warehouseId] = entry;
      persist(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetWarehouse, () => load());
  },
});

export const { initSeen, markSeen } = seenSlice.actions;
export default seenSlice.reducer;