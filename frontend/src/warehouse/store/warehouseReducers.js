import { combineReducers } from '@reduxjs/toolkit';
import core from './slices/warehouseSlice';
import inventory from './slices/inventorySlice';
import receiving from './slices/receivingSlice';
import movement from './slices/movementSlice';
import orderSummary from './slices/orderSummarySlice';
import seen from './slices/seenSlice';

export const warehouseReducer = combineReducers({ core, inventory, receiving, movement, orderSummary, seen });

export const warehouseReducers = { warehouse: warehouseReducer };