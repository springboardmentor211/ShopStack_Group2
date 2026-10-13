const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

export const mockInbound = [
  { warehouseId: 'WH-NORTH', id: 'ASN-2048', vendorId: 'VND-106', sku: 'S360-HOM-007', qty: 20, status: 'received', bin: 'D-01-03', arrivedAt: minutesAgo(240), receivedAt: minutesAgo(30) },
  { warehouseId: 'WH-NORTH', id: 'ASN-2051', vendorId: 'VND-103', sku: 'S360-SHO-005', qty: 60, status: 'pending', bin: null, arrivedAt: minutesAgo(200), receivedAt: null },
  { warehouseId: 'WH-NORTH', id: 'ASN-2054', vendorId: 'VND-105', sku: 'S360-FAS-006', qty: 80, status: 'pending', bin: null, arrivedAt: minutesAgo(280), receivedAt: null },
  { warehouseId: 'WH-NORTH', id: 'ASN-2058', vendorId: 'VND-101', sku: 'S360-AUD-002', qty: 40, status: 'pending', bin: null, arrivedAt: minutesAgo(145), receivedAt: null },
  { warehouseId: 'WH-SOUTH', id: 'ASN-3001', vendorId: 'VND-101', sku: 'S360-MOB-001', qty: 15, status: 'pending', bin: null, arrivedAt: minutesAgo(90), receivedAt: null },
];
