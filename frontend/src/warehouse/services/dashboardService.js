import { USE_MOCK } from './config';
import { apiRequest } from './http';
import { clone, wait } from './mockUtils';
import { mockOrderSummary } from '../mocks/orderSummaryMock';

const EMPTY_SUMMARY = {
  dueToday: 0,
  pipeline: { pending: 0, confirmed: 0, picked: 0, packed: 0, shipped: 0, out_for_delivery: 0, delivered: 0 },
};

export async function getOrderSummary(warehouseId) {
  if (USE_MOCK) {
    await wait();
    return clone(mockOrderSummary[warehouseId] || EMPTY_SUMMARY);
  }

  return apiRequest(`/api/warehouses/${warehouseId}/orders/summary`);
}
