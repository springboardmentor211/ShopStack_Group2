import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_RETURNS = [
  {
    id: 'RET-6101',
    orderId: 'ORD-24088',
    productName: 'Noir Eau de Parfum',
    productImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=100&q=80',
    customer: 'Kabir Rao',
    seller: 'House & Trail',
    reason: 'Item damaged on arrival',
    amount: '₹2,899',
    status: 'Pending Review',
    date: '27 Sep 2026',
  },
  {
    id: 'RET-6102',
    orderId: 'ORD-24085',
    productName: 'Wireless Noise Cancelling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80',
    customer: 'Diya Shah',
    seller: 'TechWorld',
    reason: 'Wrong item delivered',
    amount: '₹4,999',
    status: 'Approved',
    date: '25 Sep 2026',
  },
  {
    id: 'RET-6103',
    orderId: 'ORD-24079',
    productName: 'Minimalist Leather Watch',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
    customer: 'Aarav Mehta',
    seller: 'Aura Lifestyle',
    reason: 'Defective product',
    amount: '₹3,499',
    status: 'Refunded',
    date: '22 Sep 2026',
  },
];

export default function Returns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Returns');
  const navigate = useNavigate();

  const filteredReturns = INITIAL_RETURNS.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Returns & Disputes</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Returns & Disputes</h2>
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
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs">
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

      {/* 2. Page Header */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] mb-1 inline-block"
        >
          ← Back to Overview
        </button>
        <h1 className="text-3xl font-bold text-[#1a1612]">Returns & Disputes</h1>
        <p className="text-xs text-[#8c827a] mt-1">Review and manage marketplace records.</p>
      </div>

      {/* 3. Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
          <p className="text-xs text-[#8c827a] font-medium">Return Requests</p>
          <p className="text-2xl font-bold text-[#1a1612] mt-3">126</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
          <p className="text-xs text-[#8c827a] font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-[#1a1612] mt-3">18</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
          <p className="text-xs text-[#8c827a] font-medium">Approved</p>
          <p className="text-2xl font-bold text-[#1a1612] mt-3">62</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
          <p className="text-xs text-[#8c827a] font-medium">Refunded</p>
          <p className="text-2xl font-bold text-[#1a1612] mt-3">39</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs col-span-2 md:col-span-1">
          <p className="text-xs text-[#8c827a] font-medium">Open Disputes</p>
          <p className="text-2xl font-bold text-[#1a1612] mt-3">7</p>
        </div>
      </div>

      {/* 4. Sub-Tabs */}
      <div className="flex items-center gap-2 pt-2">
        {['Returns', 'Replacements', 'Disputes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-[#f4ebe1] text-[#1a1612]'
                : 'text-[#8c827a] hover:text-[#1a1612]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 5. Filter & Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#eae3da] grid grid-cols-1 md:grid-cols-3 gap-4 shadow-2xs">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-[#8c827a] block mb-2">Search Returns & Disputes</label>
          <input
            type="text"
            placeholder="Return ID, order or product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2.5 text-xs text-[#1a1612] outline-none placeholder-[#b8aeb0]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#8c827a] block mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2.5 text-xs text-[#1a1612] outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* 6. Returns Data Table - Responsive & Perfect Alignment */}
      <div className="bg-[#f9f5ef] rounded-2xl border border-[#eae3da] overflow-x-auto shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#f5ebd9]/60 border-b border-[#eae3da] text-[11px] font-bold text-[#8c827a] whitespace-nowrap">
              <th className="py-4 px-4 pl-6">Return ID</th>
              <th className="py-4 px-4">Order ID</th>
              <th className="py-4 px-4">Product</th>
              <th className="py-4 px-4">Customer</th>
              <th className="py-4 px-4">Seller</th>
              <th className="py-4 px-4">Reason</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4 pr-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#eae3da] text-xs">
            {filteredReturns.map((row) => (
              <tr key={row.id} className="hover:bg-[#fcf8f2]/50 transition">
                <td className="py-4 px-4 pl-6 font-medium text-[#1a1612] whitespace-nowrap">{row.id}</td>
                <td className="py-4 px-4 font-medium text-[#1a1612] whitespace-nowrap">{row.orderId}</td>
                <td className="py-4 px-4 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <img
                      src={row.productImage}
                      alt={row.productName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#eae3da] shrink-0"
                    />
                    <span className="font-bold text-[#1a1612] leading-snug">{row.productName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#1a1612] font-medium whitespace-nowrap">{row.customer}</td>
                <td className="py-4 px-4 text-[#1a1612] whitespace-nowrap">{row.seller}</td>
                <td className="py-4 px-4 text-[#70665f] min-w-[180px]">{row.reason}</td>
                <td className="py-4 px-4 font-bold text-[#1a1612] whitespace-nowrap">{row.amount}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                      row.status === 'Pending Review'
                        ? 'bg-[#fef3d6] text-[#a16207]'
                        : 'bg-[#e2f3e8] text-[#2d6a4f]'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#1a1612] whitespace-nowrap">{row.date}</td>
                <td className="py-4 px-4 pr-6 text-center whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/returns/${row.id}`)}
                    className="border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] px-4 py-1.5 rounded-xl font-semibold text-xs transition shadow-2xs"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}