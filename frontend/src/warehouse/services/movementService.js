import { USE_MOCK } from './config';
import { apiRequest } from './http';
import { clone, wait } from './mockUtils';
import { mockMovements } from '../mocks/movementsMock';

export function recordMockMovement(movement) {
  const nextNumber = mockMovements.reduce((max, m) => Math.max(max, Number(m.id.split('-')[1])), 0) + 1;
  const entry = { id: `MOV-${nextNumber}`, at: new Date().toISOString(), ...movement };
  mockMovements.unshift(entry);
  return entry;
}

export async function getMovements(warehouseId) {
  if (USE_MOCK) {
    await wait();
    return clone(
      mockMovements
        .filter((m) => m.warehouseId === warehouseId)
        .sort((a, b) => new Date(b.at) - new Date(a.at))
    );
  }

  return apiRequest(`/api/warehouses/${warehouseId}/movements`);
}
