import { USE_MOCK } from './config';
import { apiRequest } from './http';
import { clone, wait } from './mockUtils';
import { mockMovements } from '../mocks/movementsMock';

const MOVEMENTS_KEY = 'shopstack.warehouse-movements.demo.v1';
const PLACED_KEY = 'shopstack.warehouse-placed.demo.v1';
const MAX_STORED = 300;

function readList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

function nextNumber() {
  const all = [...readList(MOVEMENTS_KEY), ...mockMovements];
  return all.reduce((max, m) => Math.max(max, Number(String(m.id).split('-')[1]) || 0), 0) + 1;
}

export function addMockMovement(movement) {
  const entry = { id: `MOV-${nextNumber()}`, at: new Date().toISOString(), ...movement };
  writeList(MOVEMENTS_KEY, [entry, ...readList(MOVEMENTS_KEY)].slice(0, MAX_STORED));
  return entry;
}

function describeStatus(order, item, status) {
  const ref = order.orderNumber;
  const carrier = order.carrier || 'Carrier';
  const city = order.customer?.city || 'Customer';
  const customer = order.customer?.name || 'Customer';

  switch (status) {
    case 'CONFIRMED':
      return { type: 'Confirmed', from: 'Order desk', to: `${ref} · Pick queue` };
    case 'PICKED':
      return { type: 'Pick', from: item.bin || 'Bin', to: `${ref} · Pack staging` };
    case 'PACKED':
      return { type: 'Pack', from: 'Pack staging', to: `${ref} · Packed` };
    case 'SHIPPED':
      return { type: 'Ship', from: `${ref} · Pack staging`, to: carrier };
    case 'OUT_FOR_DELIVERY':
      return { type: 'Out for delivery', from: carrier, to: `${ref} · ${city}` };
    case 'DELIVERED':
      return { type: 'Delivered', from: `${ref} · ${carrier}`, to: `${customer}, ${city}` };
    case 'CANCELLED':
      return { type: 'Cancelled', from: ref, to: 'Cancelled' };
    default:
      return null;
  }
}

export function recordOrderStatus(warehouseId, order, status, performedBy) {
  if (!USE_MOCK || !warehouseId || !order?.items) return false;
  let written = false;
  order.items.forEach((item) => {
    const detail = describeStatus(order, item, status);
    if (!detail) return;
    addMockMovement({
      warehouseId,
      sku: item.sku,
      qty: item.quantity,
      performedBy: performedBy || 'Warehouse staff',
      ...detail,
    });
    written = true;
  });
  return written;
}

export function recordPlacedOrders(warehouseId, orders) {
  if (!USE_MOCK || !warehouseId) return false;
  const logged = readList(PLACED_KEY);
  const fresh = orders.filter((order) => order.status === 'PENDING' && !logged.includes(order.id));
  if (!fresh.length) return false;

  fresh.forEach((order) => {
    order.items.forEach((item) => {
      addMockMovement({
        warehouseId,
        sku: item.sku,
        type: 'Order placed',
        from: order.customer?.name || 'Customer',
        to: `${order.orderNumber} · Order desk`,
        qty: item.quantity,
        performedBy: 'Customer',
      });
    });
  });
  writeList(PLACED_KEY, [...logged, ...fresh.map((order) => order.id)]);
  return true;
}

export async function getMovements(warehouseId) {
  if (USE_MOCK) {
    await wait();
    const all = [...readList(MOVEMENTS_KEY), ...mockMovements];
    return clone(
      all
        .filter((m) => m.warehouseId === warehouseId)
        .sort((a, b) => new Date(b.at) - new Date(a.at))
    );
  }

  return apiRequest(`/api/warehouses/${warehouseId}/movements`);
}