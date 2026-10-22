import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState('Marketplace Settings');

  // Form states
  const [displayName, setDisplayName] = useState('Shop360');
  const [policyStatus, setPolicyStatus] = useState('Enabled');

  const tabs = [
    'Marketplace Settings',
    'Order Settings',
    'Return Policy',
    'Payment Settings',
    'Seller Policies',
    'Logistics Settings',
    'Notifications',
    'Security',
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    setDisplayName('Shop360');
    setPolicyStatus('Enabled');
  };

  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Settings</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Settings</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search orders, users, sellers or products..."
              className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2 text-xs text-[#1a1612] outline-none shadow-2xs placeholder-[#a8a096]"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs cursor-pointer">
            <svg className="w-4 h-4 text-[#70665f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center gap-2 bg-white border border-[#eae3da] rounded-xl px-3 py-1.5 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#1a1612] text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-tight text-[#1a1612]">Hi, Admin</p>
              <p className="text-[10px] text-[#8c827a] leading-tight">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="pt-1">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] transition-colors mb-1 inline-block cursor-pointer"
        >
          ← Back to Overview
        </button>
        <h1 className="text-3xl font-bold text-[#1a1612]">Admin Settings</h1>
        <p className="text-xs text-[#8c827a] mt-1">
          Configure marketplace-wide policies.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#f5ebd9] text-[#1a1612]'
                : 'text-[#8c827a] hover:text-[#1a1612] hover:bg-[#fcf8f2]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-[#1a1612]">{activeTab}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketplace Display Name */}
          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-2">
              Marketplace display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2.5 text-xs text-[#1a1612] font-medium outline-none focus:border-[#d8ba78]"
            />
          </div>

          {/* Policy Status Dropdown */}
          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-2">
              Policy status
            </label>
            <select
              value={policyStatus}
              onChange={(e) => setPolicyStatus(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2.5 text-xs text-[#1a1612] font-medium outline-none cursor-pointer focus:border-[#d8ba78]"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
              <option value="Maintenance">Maintenance Mode</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}