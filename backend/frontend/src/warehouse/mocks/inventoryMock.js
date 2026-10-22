import { mockCatalog } from './catalogMock';

const stock = [
  ['S360-MOB-001', 'B', 'B-01-04', 32],
  ['S360-AUD-002', 'B', 'B-02-03', 18],
  ['S360-LAP-003', 'B', 'B-07-05', 9],
  ['S360-WAT-004', 'B', 'B-03-01', 25],
  ['S360-SHO-005', 'C', 'C-01-09', 6],
  ['S360-FAS-006', 'C', 'C-02-04', 0],
  ['S360-HOM-007', 'D', 'D-01-03', 14],
  ['S360-BEA-008', 'A', 'A-03-02', 41],
];

export const mockInventory = stock.map(([sku, zone, bin, qty]) => ({
  warehouseId: 'WH-NORTH',
  sku,
  zone,
  bin,
  qty,
  ...mockCatalog[sku],
}));
