import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_SHIPMENTS = [
  {
    trackingId: 'TRK-993201',
    orderId: 'ORD-24090',
    courier: 'SwiftShip',
    originWarehouse: 'Pune Distribution Centre',
    destination: 'Ahmedabad, Gujarat',
    status: 'In Transit',
    estimatedDelivery: '01 Oct 2026',
    delayStatus: 'On time',
    timeline: [
      { title: 'Dispatched', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'In Transit', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'Reached Hub', sub: 'Recorded in marketplace activity', completed: false },
      { title: 'Out for Delivery', sub: 'Awaiting next update', completed: false },
      { title: 'Delivered', sub: 'Awaiting next update', completed: false },
    ],
  },
  {
    trackingId: 'TRK-993202',
    orderId: 'ORD-24091',
    courier: 'ParcelOne',
    originWarehouse: 'Mumbai Central Hub',
    destination: 'Mumbai, Maharashtra',
    status: 'Processing',
    estimatedDelivery: '02 Oct 2026',
    delayStatus: 'On time',
    timeline: [
      { title: 'Dispatched', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'In Transit', sub: 'Awaiting next update', completed: false },
      { title: 'Reached Hub', sub: 'Awaiting next update', completed: false },
      { title: 'Out for Delivery', sub: 'Awaiting next update', completed: false },
      { title: 'Delivered', sub: 'Awaiting next update', completed: false },
    ],
  },
  {
    trackingId: 'TRK-993203',
    orderId: 'ORD-24089',
    courier: 'SwiftShip',
    originWarehouse: 'Mumbai Central Hub',
    destination: 'Pune, Maharashtra',
    status: 'Delivered',
    estimatedDelivery: '27 Sep 2026',
    delayStatus: 'On time',
    timeline: [
      { title: 'Dispatched', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'In Transit', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'Reached Hub', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'Out for Delivery', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'Delivered', sub: 'Recorded in marketplace activity', completed: true },
    ],
  },
  {
    trackingId: 'TRK-993204',
    orderId: 'ORD-24087',
    courier: 'ParcelOne',
    originWarehouse: 'Pune Distribution Centre',
    destination: 'Nashik, Maharashtra',
    status: 'Delayed',
    estimatedDelivery: '30 Sep 2026',
    delayStatus: 'Weather exception',
    timeline: [
      { title: 'Dispatched', sub: 'Recorded in marketplace activity', completed: true },
      { title: 'In Transit', sub: 'Delayed due to weather exception', completed: false },
      { title: 'Reached Hub', sub: 'Awaiting next update', completed: false },
      { title: 'Out for Delivery', sub: 'Awaiting next update', completed: false },
      { title: 'Delivered', sub: 'Awaiting next update', completed: false },
    ],
  },
];

export default function Logistics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courierFilter, setCourierFilter] = useState('All Courier');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [regionFilter, setRegionFilter] = useState('All Region');
  const [fromDate, setFromDate] = useState('');

  // Selected shipment capture cheyadaniki state
  const [selectedShipment, setSelectedShipment] = useState(null);

  const navigate = useNavigate();

  const filteredShipments = INITIAL_SHIPMENTS.filter((item) => {
    const matchesSearch =
      item.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourier = courierFilter === 'All Courier' || item.courier === courierFilter;
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;

    return matchesSearch && matchesCourier && matchesStatus;
  });

  // Selected shipment unte direct ga shipment details screen చూపిస్తుంది
  if (selectedShipment) {
    return (
      <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Back Button to return to list */}
            <button
              onClick={() => setSelectedShipment(null)}
              className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] transition-colors mb-2 inline-flex items-center gap-1 cursor-pointer"
            >
              ← Back to Logistics
            </button>
            <h1 className="text-2xl font-bold text-[#1a1612]">Shipment Details</h1>
            <p className="text-xs text-[#8c827a] mt-0.5">
              {selectedShipment.trackingId} •{' '}
              <span className="font-medium text-[#1a1612]">{selectedShipment.status}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all cursor-pointer">
              View Order
            </button>
            <button className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all cursor-pointer">
              View Courier Details
            </button>
            <button className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all cursor-pointer">
              Flag Issue
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Timeline & Delay Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Timeline Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs">
              <h2 className="text-base font-bold text-[#1a1612] mb-6">Shipment Timeline</h2>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eae3da]">
                {selectedShipment.timeline?.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <span
                      className={`absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full border-2 ${
                        item.completed
                          ? 'bg-[#c29b38] border-[#c29b38]'
                          : 'bg-white border-[#d0c7bd]'
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#1a1612]">{item.title}</h3>
                      <p className="text-xs text-[#8c827a] mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delay / Exception Information Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs">
              <h2 className="text-base font-bold text-[#1a1612] mb-2">
                Delay / Exception Information
              </h2>
              <p className="text-xs text-[#8c827a]">
                {selectedShipment.status === 'Delayed'
                  ? `Exception noted: ${selectedShipment.delayStatus}`
                  : 'No active shipment exceptions.'}
              </p>
            </div>
          </div>

          {/* Right Column: Shipment Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs">
              <h2 className="text-base font-bold text-[#1a1612] mb-6">Shipment Summary</h2>

              <div className="grid grid-cols-2 gap-y-6 text-xs">
                <div>
                  <p className="text-[#8c827a] font-medium">Tracking ID</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.trackingId}</p>
                </div>

                <div>
                  <p className="text-[#8c827a] font-medium">Order ID</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.orderId}</p>
                </div>

                <div className="pt-4 border-t border-[#f4f0eb]">
                  <p className="text-[#8c827a] font-medium">Courier</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.courier}</p>
                </div>

                <div className="pt-4 border-t border-[#f4f0eb]">
                  <p className="text-[#8c827a] font-medium">Warehouse</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.originWarehouse}</p>
                </div>

                <div className="pt-4 border-t border-[#f4f0eb]">
                  <p className="text-[#8c827a] font-medium">Destination Summary</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.destination}</p>
                </div>

                <div className="pt-4 border-t border-[#f4f0eb]">
                  <p className="text-[#8c827a] font-medium">Estimated Delivery</p>
                  <p className="font-bold text-[#1a1612] mt-1">{selectedShipment.estimatedDelivery}</p>
                </div>

                <div className="col-span-2 pt-4 border-t border-[#f4f0eb]">
                  <p className="text-[#8c827a] font-medium mb-2">Status</p>
                  <span className="inline-block px-3 py-1 bg-[#fdf8ec] text-[#b58a28] rounded-full text-xs font-semibold border border-[#f5ebcf]">
                    {selectedShipment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Selected shipment `null` ఉన్నప్పుడు సాధారణ లాజిస్టిక్స్ లిస్ట్ స్క్రీన్
  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Logistics</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Logistics</h2>
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

      {/* Page Header */}
      <div className="pt-1">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] mb-1 inline-block"
        >
          ← Back to Overview
        </button>
        <h1 className="text-3xl font-bold text-[#1a1612]">Logistics</h1>
        <p className="text-xs text-[#8c827a] mt-1">Monitor courier progress and exceptions.</p>
      </div>

      {/* Metric Cards Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">Active Shipments</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">327</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">In Transit</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">184</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">Out for Delivery</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">72</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">Delivered Today</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">96</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">Delayed Shipments</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">12</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
            <p className="text-xs text-[#8c827a] font-medium">Failed Deliveries</p>
            <p className="text-3xl font-bold text-[#1a1612] mt-3">3</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">Search Logistics</label>
            <input
              type="text"
              placeholder="Tracking ID, order or courier"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none placeholder-[#b8aeb0]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">Courier</label>
            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="All Courier">All Courier</option>
              <option value="SwiftShip">SwiftShip</option>
              <option value="ParcelOne">ParcelOne</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="In Transit">In Transit</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="All Region">All Region</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#f9f5ef] rounded-2xl border border-[#eae3da] overflow-x-auto shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead>
            <tr className="bg-[#f5ebd9]/60 border-b border-[#eae3da] text-[11px] font-bold text-[#8c827a] whitespace-nowrap">
              <th className="py-4 px-4 pl-6">Tracking ID</th>
              <th className="py-4 px-4">Order ID</th>
              <th className="py-4 px-4">Courier</th>
              <th className="py-4 px-4">Origin Warehouse</th>
              <th className="py-4 px-4">Destination</th>
              <th className="py-4 px-4">Current Status</th>
              <th className="py-4 px-4">Estimated Delivery</th>
              <th className="py-4 px-4">Delay Status</th>
              <th className="py-4 px-4 pr-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#eae3da] text-xs">
            {filteredShipments.map((row) => (
              <tr key={row.trackingId} className="hover:bg-[#fcf8f2]/50 transition">
                <td className="py-4 px-4 pl-6 font-medium text-[#1a1612] whitespace-nowrap">{row.trackingId}</td>
                <td className="py-4 px-4 font-medium text-[#1a1612] whitespace-nowrap">{row.orderId}</td>
                <td className="py-4 px-4 text-[#1a1612] whitespace-nowrap">{row.courier}</td>
                <td className="py-4 px-4 text-[#1a1612] max-w-[180px] leading-relaxed">{row.originWarehouse}</td>
                <td className="py-4 px-4 text-[#1a1612] max-w-[180px] leading-relaxed">{row.destination}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                      row.status === 'In Transit'
                        ? 'bg-[#fef3d6] text-[#a16207]'
                        : row.status === 'Processing'
                        ? 'bg-[#f0e8d5] text-[#785b28]'
                        : row.status === 'Delivered'
                        ? 'bg-[#e2f3e8] text-[#2d6a4f]'
                        : 'bg-[#fee2e2] text-[#b91c1c]'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#1a1612] whitespace-nowrap">{row.estimatedDelivery}</td>
                <td className="py-4 px-4 text-[#70665f] whitespace-nowrap">
                  {row.status === 'Delayed' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#fef3d6] text-[#a16207] text-[10px] font-bold">
                        Warning
                      </span>
                      <span>{row.delayStatus}</span>
                    </div>
                  ) : (
                    <span>{row.delayStatus}</span>
                  )}
                </td>
                <td className="py-4 px-4 pr-6 text-center whitespace-nowrap">
                  <button
                    onClick={() => setSelectedShipment(row)}
                    className="border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] px-3.5 py-1.5 rounded-xl font-semibold text-xs transition shadow-2xs cursor-pointer"
                  >
                    View Shipment
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