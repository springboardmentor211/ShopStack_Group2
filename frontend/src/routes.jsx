import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./vendor/pages/Dashboard/Dashboard";
import OffersCoupons from "./vendor/pages/Offers & Coupons/OffersCoupons";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Default page */}
      <Route
        path="/"
        element={
          <Navigate
            to="/vendor/dashboard"
            replace
          />
        }
      />

      {/* Vendor Dashboard */}
      <Route
        path="/vendor/dashboard"
        element={<Dashboard />}
      />

      {/* Offers & Coupons */}
      <Route
        path="/vendor/offers-coupons"
        element={<OffersCoupons />}
      />

      {/* Temporary routes */}
      <Route
        path="/vendor/products"
        element={
          <div style={{ padding: "40px" }}>
            Products page will be added next.
          </div>
        }
      />

      <Route
        path="/vendor/orders"
        element={
          <div style={{ padding: "40px" }}>
            Orders page will be added by the respective teammate.
          </div>
        }
      />

      <Route
        path="/vendor/inventory"
        element={
          <div style={{ padding: "40px" }}>
            Inventory page will be added next.
          </div>
        }
      />

      <Route
        path="/vendor/analytics"
        element={
          <div style={{ padding: "40px" }}>
            Analytics page will be added later.
          </div>
        }
      />

      <Route
        path="/vendor/settings"
        element={
          <div style={{ padding: "40px" }}>
            Settings page will be added next.
          </div>
        }
      />

      {/* Unknown URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/vendor/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;