import { combineReducers } from '@reduxjs/toolkit';
import core from './slices/warehouseSlice';
import inventory from './slices/inventorySlice';
import receiving from './slices/receivingSlice';
import movement from './slices/movementSlice';
import orderSummary from './slices/orderSummarySlice';
import { resetWarehouse, resetWarehouseData } from './actions';

const combined = combineReducers({ core, inventory, receiving, movement, orderSummary });

export const warehouseReducer = (state, action) => {
  if (resetWarehouse.match(action)) return combined(undefined, action);
  if (resetWarehouseData.match(action)) {
    const fresh = combined(undefined, action);
    return state ? { ...fresh, core: { ...state.core, lastSyncedAt: null } } : fresh;
  }
  return combined(state, action);
};

export const warehouseReducers = { warehouse: warehouseReducer };
