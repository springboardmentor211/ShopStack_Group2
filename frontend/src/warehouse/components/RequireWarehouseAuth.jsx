import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isWarehouseLoggedIn, setWarehouseSession } from '../services/warehouseSession';
import { USE_MOCK } from '../services/config';
import { CURRENT_WAREHOUSE_ID, mockWarehouses } from '../mocks/authMock';

export default function RequireWarehouseAuth({ children }) {
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (USE_MOCK && !isWarehouseLoggedIn()) {
      const warehouse = mockWarehouses.find((item) => item.id === CURRENT_WAREHOUSE_ID);
      setWarehouseSession({
        token: 'mock-session',
        warehouseId: CURRENT_WAREHOUSE_ID,
        name: warehouse?.ownerName || 'Warehouse manager',
        email: 'warehouse-demo@shopstack.local',
      });
    }
    setAuthReady(true);
  }, []);

  if (!authReady) return null;

  if (!isWarehouseLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
