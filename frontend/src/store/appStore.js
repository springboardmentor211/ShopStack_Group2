import { configureStore } from '@reduxjs/toolkit';
import { warehouseReducers } from '../warehouse/store/warehouseReducers';

export const store = configureStore({
  reducer: {
    ...warehouseReducers,
  },
});