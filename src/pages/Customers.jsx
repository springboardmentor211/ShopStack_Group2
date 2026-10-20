import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Bell, ArrowLeft, Search, Calendar 
} from 'lucide-react';

export default function Customers() {
  const customerRecords = [
    {
      name: "Aarav Mehta",
      id: "C1001",
      email: "aarav.m@example.com",
      orders: 12,
      totalSpend: "₹89,490",
      returns: 1,
      joined: "12 Jun 2025",
      status: "Active"
    },
    {
      name: "Diya Shah",
      id: "C1002",
      email: "diya.s@example.com",
      orders: 7,
      totalSpend: "₹42,380",
      returns: 0,
      joined: "03 Jan 2026",
      status: "Active"
    },
    {
      name: "Kabir Rao",
      id: "C1003",
      email: "kabir.r@example.com",
      orders: 4,
      totalSpend: "₹15,980",
      returns: 2,
      joined: "19 Feb 2026",
      status: "Suspended"
    },
    {
      name: "Nisha Patel",
      id: "C1004",
      email: "nisha.p@example.com",
      orders: 2,
      totalSpend: "₹7,698",
      returns: 0,
      joined: "08 Sep 2026",
      status: "Active"
    }
  ];

  return (
    <div className="text-[#2D241E]">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white rounded-xl border border-[#EAE3DA] text-gray-600 hover:bg-gray-50">
            <Menu size={18} />
          </button>
          <div>
            <div className="text-xs text-[#8C827A]">Overview &gt; <span className="font-semibold text-[#1A1612]">Customers</span></div>
            <h1 className="text-xl font-bold text-[#1A1612]">Customers</h1>
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

      {/* Back to Overview Link */}
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1612] hover:underline">
          <ArrowLeft size={14} /> Back to Overview
        </Link>
        <h2 className="text-2xl font-bold text-[#1A1612] mt-2">Customers</h2>
        <p className="text-xs text-[#7A7067] mt-0.5">Review and manage marketplace records.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Total Customers</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">12,540</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Active Customers</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">12,310</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">New This Month</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">438</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Suspended Accounts</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">42</h3>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Search Customers</label>
            <input 
              type="text" 
              placeholder="Customer name, email, phone or ID" 
              className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] placeholder-[#A0958C] outline-none focus:border-[#C39A6B]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Status</label>
            <select className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Order Activity</label>
            <select className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]">
              <option>All Order Activity</option>
              <option>High Activity</option>
              <option>No Orders</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">From date</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="dd-mm-yyyy" 
                className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] placeholder-[#A0958C] outline-none focus:border-[#C39A6B]"
              />
              <Calendar size={14} className="absolute right-3 top-2.5 text-[#8C827A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAE3DA] text-[#8C827A] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-4">Returns</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA] bg-white">
              {customerRecords.map((item) => (
                <tr key={item.id} className="hover:bg-[#FCF8F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#1A1612]">{item.name}</td>
                  <td className="py-3.5 px-4 text-[#5A5047] font-medium">{item.id}</td>
                  <td className="py-3.5 px-4 text-[#5A5047]">{item.email}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{item.orders}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{item.totalSpend}</td>
                  <td className="py-3.5 px-4 text-[#5A5047]">{item.returns}</td>
                  <td className="py-3.5 px-4 text-[#5A5047]">{item.joined}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                      item.status === 'Active' 
                        ? 'bg-[#E2F3E7] text-[#1E7238]' 
                        : 'bg-[#FDE8E8] text-[#9B1C1C]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="px-3 py-1.5 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                        View Customer
                      </button>
                      {item.status === 'Active' ? (
                        <button className="px-3 py-1.5 bg-white border border-[#F2C5C5] text-[#9B1C1C] font-semibold rounded-lg hover:bg-red-50 text-[11px]">
                          Suspend
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                          Reactivate
                        </button>
                      )}
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