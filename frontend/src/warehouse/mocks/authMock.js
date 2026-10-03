export const mockWarehouses = [
  { id: 'WH-NORTH', name: 'North Hub', city: 'Pune', ownerName: 'Maya Sharma', role: 'Warehouse manager' },
  { id: 'WH-SOUTH', name: 'South Hub', city: 'Bengaluru', ownerName: 'Karan Mehta', role: 'Warehouse manager' },
  { id: 'WH-NEW', name: 'New Hub', city: 'Nagpur', ownerName: 'Neha Patil', role: 'Warehouse manager' },
];

export const CURRENT_WAREHOUSE_ID = import.meta.env.VITE_MOCK_WAREHOUSE_ID || 'WH-NORTH';
