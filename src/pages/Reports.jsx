import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();

  // Filter States
  const [reportCategory, setReportCategory] = useState('Sales');
  const [dateRange, setDateRange] = useState('Today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Sample Data for Charts
  const revenueData = [
    { label: 'Mon', val: 20 },
    { label: 'Tue', val: 35 },
    { label: 'Wed', val: 30 },
    { label: 'Thu', val: 65 },
    { label: 'Fri', val: 75 },
    { label: 'Sat', val: 85 },
    { label: 'Sun', val: 80 },
  ];

  const orderTrendData = [
    { label: 'Mon', val: 40 },
    { label: 'Tue', val: 55 },
    { label: 'Wed', val: 50 },
    { label: 'Thu', val: 65 },
    { label: 'Fri', val: 75 },
    { label: 'Sat', val: 60 },
    { label: 'Sun', val: 85 },
  ];

  const categoryData = [
    { label: 'Tech', val: 85 },
    { label: 'Home', val: 45 },
    { label: 'Style', val: 70 },
    { label: 'Books', val: 35 },
  ];

  const sellerData = [
    { label: 'North', val: 80 },
    { label: 'Everyday', val: 60 },
    { label: 'Trail', val: 45 },
  ];

  const returnRateData = [
    { label: 'Jun', val: 30 },
    { label: 'Jul', val: 25 },
    { label: 'Aug', val: 35 },
    { label: 'Sep', val: 20 },
  ];

  // Helper Bar Chart Component
  const CustomBarChart = ({ title, data, height = 'h-48' }) => (
    <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs flex flex-col justify-between">
      <h3 className="text-base font-bold text-[#1a1612] mb-6">{title}</h3>
      <div className={`relative ${height} flex items-end justify-around gap-2 pt-6 border-b border-[#eae3da]/60 pb-2`}>
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 z-0">
          <div className="border-b border-[#eae3da]" />
          <div className="border-b border-[#eae3da]" />
          <div className="border-b border-[#eae3da]" />
          <div className="border-b border-[#eae3da]" />
        </div>

        {/* Bars */}
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full justify-end z-10 group">
            <div
              style={{ height: `${item.val}%` }}
              className="w-full max-w-[42px] bg-[#b89153] hover:bg-[#a37c3f] transition-all rounded-t-sm"
            />
            <span className="text-[11px] font-semibold text-[#8c827a] mt-3 absolute -bottom-6">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-4" />
    </div>
  );

  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Reports</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Reports</h2>
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

      {/* Page Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] transition-colors mb-1 inline-block cursor-pointer"
          >
            ← Back to Overview
          </button>
          <h1 className="text-3xl font-bold text-[#1a1612]">Reports</h1>
          <p className="text-xs text-[#8c827a] mt-1">
            Marketplace intelligence and downloadable prototype reports.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer">
            Export Report
          </button>
          <button className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all shadow-2xs cursor-pointer">
            Download CSV
          </button>
          <button className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all shadow-2xs cursor-pointer">
            Download PDF
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Report category
            </label>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="Sales">Sales</option>
              <option value="Orders">Orders</option>
              <option value="Inventory">Inventory</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Date range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Custom start
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#8c827a] outline-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Custom end
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#8c827a] outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <CustomBarChart title="Revenue Trend" data={revenueData} height="h-64" />

      {/* Grid of 4 Smaller Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomBarChart title="Order Trend" data={orderTrendData} height="h-48" />
        <CustomBarChart title="Category Performance" data={categoryData} height="h-48" />
        <CustomBarChart title="Seller Performance" data={sellerData} height="h-48" />
        <CustomBarChart title="Return Rate" data={returnRateData} height="h-48" />
      </div>
    </div>
  );
}