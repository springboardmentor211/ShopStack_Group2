import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  ClipboardList,
  Boxes,
  BarChart3,
  Percent,
  Settings,
} from "lucide-react";
import "./VendorLayout.css";

const VendorLayout = () => {
  return (
    <div className="vendor-layout">

      {/* TOP BLACK BAR */}
      <div className="vendor-topbar">
        <div>
          <strong>SHOPSTACK</strong> Vendor Centre
          <span> • Manage your catalogue with confidence</span>
        </div>

        <div className="vendor-workspace">
          Vendor workspace
        </div>
      </div>

      {/* HEADER */}
      <header className="vendor-header">
        <div>
          <p className="vendor-label">
            VENDOR CENTRE
          </p>

          <h1>
            SHOP360
          </h1>
        </div>

        <div className="vendor-store-name">
          ♧ &nbsp; North & Form Store
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="vendor-main-layout">

        {/* SIDEBAR */}
        <aside className="vendor-sidebar">

          <h2>
            VENDOR PORTAL
          </h2>

          <nav>

            <NavLink
              to="/vendor/dashboard"
              className="vendor-nav-item"
            >
              <LayoutGrid size={18} strokeWidth={2} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/vendor/products"
              className="vendor-nav-item"
            >
              <Package size={18} strokeWidth={2} />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="/vendor/orders"
              className="vendor-nav-item"
            >
              <ClipboardList size={18} strokeWidth={2} />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/vendor/inventory"
              className="vendor-nav-item"
            >
              <Boxes size={18} strokeWidth={2} />
              <span>Inventory</span>
            </NavLink>

            <NavLink
              to="/vendor/analytics"
              className="vendor-nav-item"
            >
              <BarChart3 size={18} strokeWidth={2} />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/vendor/offers-coupons"
              className="vendor-nav-item"
            >
              <Percent size={18} strokeWidth={2} />
              <span>Offers & Coupons</span>
            </NavLink>

            <NavLink
              to="/vendor/settings"
              className="vendor-nav-item"
            >
              <Settings size={18} strokeWidth={2} />
              <span>Settings</span>
            </NavLink>

          </nav>

        </aside>

        {/* PAGE CONTENT */}
        <main className="vendor-page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default VendorLayout;
