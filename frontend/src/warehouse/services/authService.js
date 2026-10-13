import { USE_MOCK } from './config';
import { apiRequest } from './http';
import { wait } from './mockUtils';
import { mockWarehouses, CURRENT_WAREHOUSE_ID } from '../mocks/authMock';

export async function getCurrentWarehouseProfile() {
  if (USE_MOCK) {
    await wait(100);
    const warehouse = mockWarehouses.find((w) => w.id === CURRENT_WAREHOUSE_ID);
    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      city: warehouse.city,
      ownerName: warehouse.ownerName,
      role: warehouse.role,
    };
  }

  return apiRequest('/api/auth/me');
}
