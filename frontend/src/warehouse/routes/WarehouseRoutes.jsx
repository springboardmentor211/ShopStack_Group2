import { Route } from 'react-router-dom';
import WarehouseLayout from '../components/layout/WarehouseLayout';
import DashboardPage from '../pages/DashboardPage';
import ReceivingPage from '../pages/ReceivingPage';
import InventoryPage from '../pages/InventoryPage';
import MovementPage from '../pages/MovementPage';

export default function WarehouseRoutes() {
  return (
    <Route path="/warehouse" element={<WarehouseLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="receiving" element={<ReceivingPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="movement" element={<MovementPage />} />
      <Route path="*" element={<div className="p-6" />} />
    </Route>
  );
}