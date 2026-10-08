import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import CustomerRoutes from './customer/routes/CustomerRoutes';
import WarehouseRoutes from './warehouse/routes/WarehouseRoutes';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/warehouse/*" element={<WarehouseRoutes />} />
          <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
