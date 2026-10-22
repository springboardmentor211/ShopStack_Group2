import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Pages Import
import Overview from './pages/Overview';
import Customers from './pages/Customers';
import Sellers from './pages/Sellers';
import SellerDetails from './pages/SellerDetails';
import Warehouses from './pages/Warehouses';
import AddWarehouse from './pages/AddWarehouse';
import Orders from './pages/Orders';
import Catalog from './pages/Catalog';
import ProductReview from './pages/ProductReview';
import Payments from './pages/Payments';
import Returns from './pages/Returns';
import Logistics from './pages/Logistics';
import Reports from './pages/Reports';
import UsersAndRoles from './pages/UsersAndRoles';

import RolesAndPermissions from './pages/RolesAndPermissions';
import Settings from './pages/Settings';

function Sidebar({ onOpenHelp, onOpenLogout }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/' },
    { name: 'Customers', path: '/customers' },
    { name: 'Sellers', path: '/sellers' },
    { name: 'Warehouses', path: '/warehouses' },
    { name: 'Orders', path: '/orders' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Payments', path: '/payments' },
    { name: 'Returns & Disputes', path: '/returns' },
    { name: 'Logistics', path: '/logistics' },
    { name: 'Reports', path: '/reports' },
    { name: 'Users & Roles', path: '/roles' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-[240px] bg-[#1a1612] text-[#d1c7bd] flex flex-col justify-between py-5 shrink-0 min-h-screen">
      <div>
        <div className="px-5 pb-5">
          <h2 className="text-white text-lg font-bold">Shop360</h2>
          <span className="text-[11px] text-[#bfa15f] tracking-wider block">ADMIN CONSOLE</span>
        </div>
        <ul className="list-none">
          {menuItems.map((item) => {
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.name} className={isActive ? 'bg-[#2b241d] border-l-4 border-[#d8ba78]' : ''}>
                <Link
                  to={item.path}
                  className={`flex items-center px-5 py-3 text-sm ${
                    isActive ? 'text-[#d8ba78] font-medium' : 'text-[#a8a096] hover:bg-[#2b241d] hover:text-[#d8ba78]'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-[#2d261e] pt-4">
        <ul className="list-none">
          <li>
            <button
              onClick={onOpenHelp}
              className="flex items-center w-full px-5 py-2 text-[#a8a096] text-sm hover:text-white cursor-pointer text-left"
            >
              Help & Support
            </button>
          </li>
          <li>
            <button
              onClick={onOpenLogout}
              className="flex items-center w-full px-5 py-2 text-[#a8a096] text-sm hover:text-white cursor-pointer text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#fcf8f2] text-[#333] relative">
        <Sidebar 
          onOpenHelp={() => setIsHelpOpen(true)} 
          onOpenLogout={() => setIsLogoutOpen(true)} 
        />
        <main className="flex-1 p-7 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/sellers/:id" element={<SellerDetails />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/warehouses/add" element={<AddWarehouse />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductReview />} />
            <Route path="/product-review/:id" element={<ProductReview />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:id" element={<Payments />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/roles" element={<UsersAndRoles />} />
            <Route path="/roles/manage" element={<RolesAndPermissions />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<Overview />} />
          </Routes>
        </main>

        {/* Help & Support Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#eae3da] animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-[#1a1612]">Help & Support</h3>
              <p className="text-xs text-[#8c827a] leading-relaxed">
                For this prototype, contact your Shop360 platform support team through your organization's established support channel.
              </p>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {isLogoutOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#eae3da] animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-[#1a1612]">Prototype Session</h3>
              <p className="text-xs text-[#8c827a] leading-relaxed">
                This standalone admin prototype has no authentication session to end.
              </p>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={() => setIsLogoutOpen(false)}
                  className="px-5 py-2 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsLogoutOpen(false)}
                  className="px-5 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}