import React from "react";

import {
  NavLink,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { Store } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  BarChart3,
  Settings
} from "lucide-react";

import Inventory from "./vendor/pages/Inventory";
import Analytics from "./vendor/pages/Analytics";

const navigationItems = [

  {
    path: "/dashboard",
    icon: <LayoutDashboard size={20} strokeWidth={1.8} />,
    label: "Dashboard"
  },

  {
    path: "/products",
     icon: <Package size={20} strokeWidth={1.8} />,
    label: "Products"
  },

  {
    path: "/orders",
    icon: <ShoppingCart size={20} strokeWidth={1.8} />,
    label: "Orders"
  },

  {
    path: "/inventory",
      icon: <Boxes size={20} strokeWidth={1.8} />,
   
    label: "Inventory"
  },

  {
    path: "/analytics",
     icon: <BarChart3 size={20} strokeWidth={1.8} />,
    label: "Analytics"
  },

  {
    path: "/settings",
    icon: <Settings size={20} strokeWidth={1.8} />,
    label: "Settings"
  }

];


function PlaceholderPage({ title }) {

  return (

    <main className="main-content">

      <div className="page-label">
        SHOP360 VENDOR CENTRE
      </div>

      <h1>{title}</h1>

      <p>
        This page is ready for your team module.
      </p>

      <div className="placeholder-card">

        <h2>{title}</h2>

        <p>
          You can connect your team functionality
          to this page later.
        </p>

      </div>

    </main>

  );

}


export default function App() {

  return (

    <>

      {/* HEADER */}

      <header className="top-header">

        <div className="brand-area">

          <div className="vendor-centre">
            Vendor Centre
          </div>

          <div className="shop360-logo">
            SHOP360
          </div>

        </div>


        <div className="store-name">
            <Store
  size={24}
  strokeWidth={1.8}
/>
          North &amp; Form Store
        </div>

      </header>


      <div className="page-layout">


        {/* SIDEBAR */}

        <aside className="sidebar">

          <nav className="sidebar-nav">

            {navigationItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >

                <span className="nav-icon">
                  {item.icon}
                </span>

                {item.label}

              </NavLink>

            ))}

          </nav>

        </aside>


        {/* PAGE ROUTES */}

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/inventory"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PlaceholderPage
                title="Dashboard"
              />
            }
          />

          <Route
            path="/products"
            element={
              <PlaceholderPage
                title="Products"
              />
            }
          />

          <Route
            path="/orders"
            element={
              <PlaceholderPage
                title="Orders"
              />
            }
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/inventory"
                replace
              />
            }
          />

        </Routes>

      </div>

    </>

  );

}