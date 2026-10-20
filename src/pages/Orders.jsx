import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sellerFilter, setSellerFilter] = useState('All Seller');
  const [warehouseFilter, setWarehouseFilter] = useState('All Warehouse');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Status');
  const [fromDate, setFromDate] = useState('');

  const stats = [
    { label: 'Total Orders', count: '2,456' },
    { label: 'Processing', count: '358' },
    { label: 'Shipped', count: '292' },
    { label: 'Delivered', count: '1,456' },
    { label: 'Cancelled', count: '68' },
    { label: 'Returned', count: '69' },
  ];

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  const ordersData = [
    {
      id: 'ORD-24091',
      customer: 'Aarav Mehta',
      seller: 'Northstar Electronics',
      items: 1,
      amount: '₹72,900',
      warehouse: 'Mumbai Central Hub',
      payment: 'Paid',
      status: 'Processing',
      date: '29 Sep 2026',
    },
    {
      id: 'ORD-24090',
      customer: 'Diya Shah',
      seller: 'House & Trail',
      items: 1,
      amount: '₹3,999',
      warehouse: 'Pune Distribution Centre',
      payment: 'Paid',
      status: 'Shipped',
      date: '28 Sep 2026',
    },
    {
      id: 'ORD-24089',
      customer: 'Nisha Patel',
      seller: 'Everyday Tech Co.',
      items: 2,
      amount: '₹6,998',
      warehouse: 'Mumbai Central Hub',
      payment: 'Paid',
      status: 'Delivered',
      date: '25 Sep 2026',
    },
    {
      id: 'ORD-24088',
      customer: 'Kabir Rao',
      seller: 'House & Trail',
      items: 1,
      amount: '₹2,899',
      warehouse: 'Delhi North Hub',
      payment: 'Refunded',
      status: 'Returned',
      date: '22 Sep 2026',
    },
    {
      id: 'ORD-24087',
      customer: 'Aarav Mehta',
      seller: 'Northstar Electronics',
      items: 1,
      amount: '₹7,999',
      warehouse: 'Pune Distribution Centre',
      payment: 'Pending',
      status: 'Pending',
      date: '29 Sep 2026',
    },
  ];

  // Filtering Logic
  const filteredOrders = ordersData.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;
    const matchesSeller = sellerFilter === 'All Seller' || order.seller === sellerFilter;
    const matchesWarehouse = warehouseFilter === 'All Warehouse' || order.warehouse === warehouseFilter;
    const matchesPayment = paymentFilter === 'All Payment Status' || order.payment === paymentFilter;

    return matchesTab && matchesSearch && matchesStatus && matchesSeller && matchesWarehouse && matchesPayment;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-[#FFF3E0] text-[#D97706]';
      case 'Shipped':
        return 'bg-[#FEF3C7] text-[#B45309]';
      case 'Delivered':
        return 'bg-[#E6F4EA] text-[#137333]';
      case 'Returned':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'Pending':
        return 'bg-[#FFF3E0] text-[#D97706]';
      case 'Cancelled':
        return 'bg-[#F3F4F6] text-[#4B5563]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentBadgeClass = (payment) => {
    switch (payment) {
      case 'Paid':
        return 'bg-[#E6F4EA] text-[#137333]';
      case 'Refunded':
        return 'bg-[#E6F4EA] text-[#137333]';
      case 'Pending':
        return 'bg-[#FFF3E0] text-[#D97706]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="text-[#2D241E]">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white rounded-xl border border-[#EAE3DA] text-gray-600 hover:bg-gray-50">
            <Menu size={18} />
          </button>
          <div>
            <div className="text-xs text-[#8C827A]">
              Overview &gt; <span className="font-semibold text-[#1A1612]">Orders</span>
            </div>
            <h1 className="text-xl font-bold text-[#1A1612]">Orders</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders, users, sellers or products..."
              className="pl-4 pr-4 py-2 border border-[#EAE3DA] rounded-xl bg-white w-[320px] text-xs outline-none focus:border-[#C39A6B]"
            />
          </div>
          <button className="p-2.5 bg-white border border-[#EAE3DA] rounded-xl text-gray-600 hover:bg-gray-50 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2.5 bg-white border border-[#EAE3DA] px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 bg-[#1A1612] text-white rounded-lg flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="text-xs">
              <strong className="block text-[#1A1612] leading-tight">Hi, Admin</strong>
              <span className="text-[10px] text-[#8C827A]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Back Link & Header Description */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1612] hover:underline mb-1">
          ← Back to Overview
        </Link>
        <h2 className="text-2xl font-bold text-[#1A1612]">All Orders</h2>
        <p className="text-xs text-[#7A7067] mt-0.5">Review and manage marketplace records.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#EAE3DA] rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-medium text-[#7A7067] mb-2">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#1A1612]">{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#EFE7DC] text-[#1A1612] font-semibold'
                : 'text-[#7A7067] hover:bg-[#F5EFE6]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="col-span-3">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">Search All Orders</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order ID, customer or product"
              className="w-full px-3 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] placeholder-[#A0958C] outline-none focus:border-[#C39A6B]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="col-span-2">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Returned</option>
            </select>
          </div>

          {/* Seller Dropdown */}
          <div className="col-span-2">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">Seller</label>
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            >
              <option>All Seller</option>
              <option>Northstar Electronics</option>
              <option>House & Trail</option>
              <option>Everyday Tech Co.</option>
            </select>
          </div>

          {/* Warehouse Dropdown */}
          <div className="col-span-2">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">Warehouse</label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            >
              <option>All Warehouse</option>
              <option>Mumbai Central Hub</option>
              <option>Pune Distribution Centre</option>
              <option>Delhi North Hub</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div className="col-span-2">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            >
              <option>All Payment Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>

          {/* From Date */}
          <div className="col-span-1">
            <label className="block text-[10px] font-medium text-[#7A7067] mb-1">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-2 py-1.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAE3DA] text-[#8C827A] font-medium text-[11px]">
                <th className="py-3 px-4 font-normal">Order ID</th>
                <th className="py-3 px-4 font-normal">Customer</th>
                <th className="py-3 px-4 font-normal">Seller</th>
                <th className="py-3 px-4 font-normal">Items</th>
                <th className="py-3 px-4 font-normal">Amount</th>
                <th className="py-3 px-4 font-normal">Warehouse</th>
                <th className="py-3 px-4 font-normal">Payment</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Date</th>
                <th className="py-3 px-4 text-center font-normal">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA] bg-white">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FCF8F2] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{order.id}</td>
                    <td className="py-3.5 px-4 text-[#1A1612]">{order.customer}</td>
                    <td className="py-3.5 px-4 text-[#1A1612]">{order.seller}</td>
                    <td className="py-3.5 px-4 text-[#1A1612]">{order.items}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{order.amount}</td>
                    <td className="py-3.5 px-4 text-[#1A1612]">{order.warehouse}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getPaymentBadgeClass(order.payment)}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#7A7067]">{order.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="px-3 py-1 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-[#7A7067]">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}