import { Navigate, Route, Routes } from 'react-router-dom';
import WarehouseRoutes from './warehouse/routes/WarehouseRoutes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/warehouse" replace />} />
      <Route path="/warehouse/*" element={<WarehouseRoutes />} />
      <Route path="*" element={<Navigate to="/warehouse" replace />} />
    </Routes>
  );
}