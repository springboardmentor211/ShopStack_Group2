import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';

import CustomerRoutes from './customer/routes/CustomerRoutes';
import WarehouseRoutes from './warehouse/routes/WarehouseRoutes';

import VendorLayout from './vendor/components/VendorLayout';
import Dashboard from './vendor/pages/Dashboard/Dashboard';
import OffersCoupons from './vendor/pages/OffersCoupons/OffersCoupons';
import Settings from './vendor/pages/Settings/Settings';
import Inventory from './vendor/pages/Inventory';
import Analytics from './vendor/pages/Analytics';
import Products from './vendor/pages/Products';
import Orders from './vendor/pages/Orders';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Vendor routes */}
          <Route path="/vendor" element={<VendorLayout />}>
            <Route
              index
              element={<Navigate to="/vendor/dashboard" replace />}
            />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="offers-coupons" element={<OffersCoupons />} />
            <Route path="settings" element={<Settings />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Warehouse routes */}
          <Route path="/warehouse/*" element={<WarehouseRoutes />} />

          {/* Customer routes */}
          <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}