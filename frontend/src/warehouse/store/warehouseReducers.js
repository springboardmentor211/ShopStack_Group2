import { combineReducers } from '@reduxjs/toolkit';
import core from './slices/warehouseSlice';
import inventory from './slices/inventorySlice';
import receiving from './slices/receivingSlice';
import movement from './slices/movementSlice';
import orderSummary from './slices/orderSummarySlice';

export const warehouseReducer = combineReducers({ core, inventory, receiving, movement, orderSummary });

export const warehouseReducers = { warehouse: warehouseReducer };
