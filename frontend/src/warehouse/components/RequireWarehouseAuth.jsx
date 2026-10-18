import { Navigate, useLocation } from 'react-router-dom';
import { isWarehouseLoggedIn } from '../services/warehouseSession';

export default function RequireWarehouseAuth({ children }) {
  const location = useLocation();

  if (!isWarehouseLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
