const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

export const mockMovements = [
  { id: 'MOV-5003', warehouseId: 'WH-NORTH', at: minutesAgo(30), sku: 'S360-HOM-007', type: 'Putaway', from: 'Kaveri Crafts', to: 'D-01-03', qty: 20, performedBy: 'Maya Sharma' },
  { id: 'MOV-5002', warehouseId: 'WH-NORTH', at: minutesAgo(62), sku: 'S360-MOB-001', type: 'Pick', from: 'B-01-04', to: 'Pack staging', qty: 1, performedBy: 'Maya Sharma' },
  { id: 'MOV-5001', warehouseId: 'WH-NORTH', at: minutesAgo(127), sku: 'S360-AUD-002', type: 'Pick', from: 'B-02-03', to: 'Pack staging', qty: 1, performedBy: 'Maya Sharma' },
];
