import { Navigate, Route, Routes } from 'react-router-dom';
import WarehouseLayout from '../components/layout/WarehouseLayout';
import DashboardPage from '../pages/DashboardPage';
import ReceivingPage from '../pages/ReceivingPage';
import InventoryPage from '../pages/InventoryPage';
import MovementPage from '../pages/MovementPage';
import OrdersPage from '../pages/OrdersPage';
import PickingPage from '../pages/PickingPage';
import ReportsPage from '../pages/ReportsPage';

function ComingSoon() {
  return (
    <div className="px-5 py-7 lg:px-8">
      <div className="wh-card rounded-2xl bg-white p-6 text-sm text-[#746D62]">This section is not available yet.</div>
    </div>
  );
}

export default function WarehouseRoutes() {
  return (
    <Routes>
      <Route path="/warehouse" element={<WarehouseLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="receiving" element={<ReceivingPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="movement" element={<MovementPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="picking" element={<PickingPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
