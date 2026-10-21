import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Bell, ArrowLeft } from 'lucide-react';

export default function SellerDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  // Multi-seller Unique Data Base
  const sellersData = {
    S101: {
      businessName: "Northstar Electronics",
      ownerName: "Rohan Kapoor",
      sellerId: "S101",
      joinedDate: "15 Mar 2024",
      rating: "4.8",
      status: "Active",
      revenue: "₹76,40,000",
      orders: "852",
      products: "186",
      returns: "14",
      timeline: [
        { title: "Seller joined", description: "Recorded in marketplace activity", time: "15 Mar 2024" },
        { title: "Business verified", description: "Recorded in marketplace activity", time: "18 Mar 2024" },
        { title: "First 100 Orders Milestone", description: "Completed successfully", time: "05 Apr 2024" }
      ]
    },
    S102: {
      businessName: "Everyday Tech Co.",
      ownerName: "Meera Iyer",
      sellerId: "S102",
      joinedDate: "10 Jan 2025",
      rating: "4.6",
      status: "Pending",
      revenue: "₹29,40,000",
      orders: "378",
      products: "94",
      returns: "5",
      timeline: [
        { title: "Seller joined", description: "Recorded in marketplace activity", time: "10 Jan 2025" },
        { title: "GST Documents Submitted", description: "Pending admin review", time: "12 Jan 2025" }
      ]
    },
    S103: {
      businessName: "House & Trail",
      ownerName: "Vikram Sethi",
      sellerId: "S103",
      joinedDate: "22 Aug 2024",
      rating: "4.7",
      status: "Active",
      revenue: "₹12,60,000",
      orders: "241",
      products: "74",
      returns: "3",
      timeline: [
        { title: "Seller joined", description: "Recorded in marketplace activity", time: "22 Aug 2024" },
        { title: "Business verified", description: "Recorded in marketplace activity", time: "25 Aug 2024" },
        { title: "Catalog Updated", description: "Added 20 new home items", time: "10 Sep 2024" }
      ]
    }
  };

  // Dynamic Lookup
  const sellerInfo = sellersData[id] || sellersData['S101'];

  const tabs = ['Overview', 'Products', 'Orders', 'Performance', 'Payouts', 'Violations', 'Activity'];

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
              Overview &gt; Sellers &gt; <span className="font-semibold text-[#1A1612]">Sellers Details</span>
            </div>
            <h1 className="text-xl font-bold text-[#1A1612]">Sellers Details</h1>
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

      {/* Back Link and Action Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/sellers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1612] hover:underline mb-2">
            <ArrowLeft size={14} /> Back to Sellers
          </Link>
          <h2 className="text-2xl font-bold text-[#1A1612]">{sellerInfo.businessName}</h2>
          <p className="text-xs text-[#7A7067] mt-1">
            {sellerInfo.ownerName} · {sellerInfo.sellerId} · Joined {sellerInfo.joinedDate} · Rating {sellerInfo.rating} · <span className={sellerInfo.status === 'Active' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>{sellerInfo.status}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-[#EAE3DA] text-[#1A1612] text-xs font-semibold rounded-xl hover:bg-[#FAF6F0]">
            Contact Seller
          </button>
          <button className="px-4 py-2 bg-white border border-[#F2C5C5] text-[#9B1C1C] text-xs font-semibold rounded-xl hover:bg-red-50">
            Suspend Seller
          </button>
        </div>
      </div>

      {/* Unique Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Revenue</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">{sellerInfo.revenue}</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Orders</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">{sellerInfo.orders}</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Products</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">{sellerInfo.products}</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Returns</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">{sellerInfo.returns}</h3>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex gap-6 border-b border-[#EAE3DA] mb-6 text-xs font-medium text-[#7A7067]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab
                ? 'text-[#1A1612] font-bold border-b-2 border-[#1A1612]'
                : 'hover:text-[#1A1612]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Activity Timeline */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-6 shadow-sm min-h-[250px]">
        <h4 className="text-sm font-bold text-[#1A1612] mb-6">All Activity</h4>

        <div className="relative pl-6 border-l-2 border-[#EAE3DA] space-y-6">
          {sellerInfo.timeline.map((event, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3 h-3 bg-[#C39A6B] rounded-full border-2 border-white"></div>
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-bold text-[#1A1612]">{event.title}</h5>
                <span className="text-[10px] text-[#8C827A]">{event.time}</span>
              </div>
              <p className="text-[11px] text-[#7A7067] mt-0.5">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}