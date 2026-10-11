import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import VendorLayout from "./vendor/components/VendorLayout";

import Dashboard from "./vendor/pages/Dashboard/Dashboard";
import OffersCoupons from "./vendor/pages/OffersCoupons/OffersCoupons";
import Settings from "./vendor/pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vendor" element={<VendorLayout />}>
          <Route
            index
            element={<Navigate to="/vendor/dashboard" replace />}
          />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="offers-coupons" element={<OffersCoupons />} />

          <Route path="products" element={<h1>Products</h1>} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="inventory" element={<h1>Inventory</h1>} />
          <Route path="analytics" element={<h1>Analytics</h1>} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/vendor/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;