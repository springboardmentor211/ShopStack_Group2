import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Plus } from 'lucide-react';

export default function Warehouses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const warehouseRecords = [
    {
      id: "W101",
      name: "Mumbai Central Hub",
      location: "Mumbai, Maharashtra",
      manager: "Ananya Desai",
      skus: 438,
      inventoryUnits: "14,520",
      assignedOrders: 87,
      capacity: "72%",
      status: "Active"
    },
    {
      id: "W102",
      name: "Pune Distribution Centre",
      location: "Pune, Maharashtra",
      manager: "Ritesh Kulkarni",
      skus: 312,
      inventoryUnits: "9,680",
      assignedOrders: 53,
      capacity: "89%",
      status: "Active"
    },
    {
      id: "W103",
      name: "Delhi North Hub",
      location: "New Delhi, Delhi",
      manager: "Priya Sharma",
      skus: 285,
      inventoryUnits: "8,210",
      assignedOrders: 41,
      capacity: "65%",
      status: "Active"
    }
  ];

  const filteredWarehouses = warehouseRecords.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Status' || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
              Overview &gt; <span className="font-semibold text-[#1A1612]">Warehouses</span>
            </div>
            <h1 className="text-xl font-bold text-[#1A1612]">Warehouses</h1>
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

      {/* Back Link & Action Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1612] hover:underline mb-1">
            ← Back to Overview
          </Link>
          <h2 className="text-2xl font-bold text-[#1A1612]">Warehouses</h2>
          <p className="text-xs text-[#7A7067] mt-0.5">Monitor network capacity and inventory.</p>
        </div>

        <Link 
          to="/warehouses/add" 
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1612] text-white text-xs font-semibold rounded-xl hover:bg-[#2D241E] transition-colors"
        >
          <Plus size={14} /> Add Warehouse
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Total Warehouses</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">34</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Active Warehouses</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">32</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Total Inventory</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">3,42,410</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Capacity Alerts</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">2</h3>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Search Warehouses</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Warehouse name, ID or location" 
                className="w-full pl-3 pr-8 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] placeholder-[#A0958C] outline-none focus:border-[#C39A6B]"
              />
            </div>
          </div>

          <div className="col-span-4">
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAE3DA] text-[#8C827A] font-semibold text-[11px]">
                <th className="py-3.5 px-4">Warehouse</th>
                <th className="py-3.5 px-4">Warehouse ID</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-4">SKUs</th>
                <th className="py-3.5 px-4">Inventory Units</th>
                <th className="py-3.5 px-4">Assigned Orders</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA] bg-white">
              {filteredWarehouses.map((item) => (
                <tr key={item.id} className="hover:bg-[#FCF8F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#1A1612]">{item.name}</td>
                  <td className="py-3.5 px-4 text-[#5A5047] font-medium">{item.id}</td>
                  <td className="py-3.5 px-4 text-[#5A5047]">{item.location}</td>
                  <td className="py-3.5 px-4 text-[#1A1612]">{item.manager}</td>
                  <td className="py-3.5 px-4 text-[#1A1612]">{item.skus}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{item.inventoryUnits}</td>
                  <td className="py-3.5 px-4 text-[#1A1612]">{item.assignedOrders}</td>
                  <td className="py-3.5 px-4 font-medium text-[#1A1612]">{item.capacity}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E2F3E7] text-[#1E7238]">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="px-2.5 py-1 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                        View Warehouse
                      </button>
                      <button className="px-2.5 py-1 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                        Edit
                      </button>
                      <button className="px-2.5 py-1 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                        Disable
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}