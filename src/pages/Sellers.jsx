import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, ArrowLeft, Calendar, Search } from 'lucide-react';

export default function Sellers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [headerSearch, setHeaderSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');

  const sellerRecords = [
    {
      seller: "Rohan Kapoor",
      businessName: "Northstar Electronics",
      sellerId: "S101",
      products: 186,
      orders: 852,
      revenue: "₹76,40,000",
      rating: 4.8,
      verification: "Approved",
      status: "Active"
    },
    {
      seller: "Meera Iyer",
      businessName: "Everyday Tech Co.",
      sellerId: "S102",
      products: 94,
      orders: 378,
      revenue: "₹29,40,000",
      rating: 4.6,
      verification: "Pending Verification",
      status: "Pending"
    },
    {
      seller: "Vikram Sethi",
      businessName: "House & Trail",
      sellerId: "S103",
      products: 74,
      orders: 241,
      revenue: "₹12,60,000",
      rating: 4.7,
      verification: "Approved",
      status: "Active"
    }
  ];

  // Common Search Redirect Handler (Press Enter)
  const handleSearchNavigation = (queryText) => {
    if (!queryText.trim()) return;
    const term = queryText.toLowerCase().trim();
    
    const matchedSeller = sellerRecords.find(
      (s) =>
        s.seller.toLowerCase().includes(term) ||
        s.businessName.toLowerCase().includes(term) ||
        s.sellerId.toLowerCase().includes(term)
    );

    if (matchedSeller) {
      navigate(`/sellers/${matchedSeller.sellerId}`);
    } else {
      alert("Seller search result not found!");
    }
  };

  // Filter for table
  const filteredSellers = sellerRecords.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status.toLowerCase() === activeTab.toLowerCase();
    const query = tableSearch.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      item.seller.toLowerCase().includes(query) ||
      item.businessName.toLowerCase().includes(query) ||
      item.sellerId.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
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
            <div className="text-xs text-[#8C827A]">Overview &gt; <span className="font-semibold text-[#1A1612]">Sellers</span></div>
            <h1 className="text-xl font-bold text-[#1A1612]">Sellers</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchNavigation(headerSearch)}
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

      {/* Back Link */}
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1612] hover:underline">
          <ArrowLeft size={14} /> Back to Overview
        </Link>
        <h2 className="text-2xl font-bold text-[#1A1612] mt-2">Sellers</h2>
        <p className="text-xs text-[#7A7067] mt-0.5">Review and manage marketplace records.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Total Sellers</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">1,280</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Active Sellers</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">1,256</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Pending Verification</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">24</h3>
        </div>
        <div className="bg-white border border-[#EAE3DA] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-[#7A7067] mb-2">Suspended Sellers</p>
          <h3 className="text-2xl font-bold text-[#1A1612]">11</h3>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex gap-2 mb-4">
        {['All', 'Active', 'Pending', 'Suspended', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#EAE3DA] text-[#1A1612] font-semibold'
                : 'text-[#7A7067] hover:bg-[#F2ECE4]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Input Filter */}
      <div className="bg-white border border-[#EAE3DA] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Search Sellers</label>
            <div className="relative">
              <input 
                type="text" 
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchNavigation(tableSearch)}
                placeholder="Seller, business or seller ID" 
                className="w-full pl-3 pr-8 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] placeholder-[#A0958C] outline-none focus:border-[#C39A6B]"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-[#8C827A] cursor-pointer" onClick={() => handleSearchNavigation(tableSearch)} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Status</label>
            <select className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]">
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#7A7067] mb-1">Category</label>
            <select className="w-full px-3 py-2 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]">
              <option>All Category</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Trail</option>
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

      {/* Sellers Table */}
      <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAE3DA] text-[#8C827A] font-semibold text-[11px]">
                <th className="py-3.5 px-4">Seller</th>
                <th className="py-3.5 px-4">Business Name</th>
                <th className="py-3.5 px-4">Seller ID</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Revenue</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA] bg-white">
              {filteredSellers.map((item) => (
                <tr key={item.sellerId} className="hover:bg-[#FCF8F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#1A1612]">
                    <button onClick={() => navigate(`/sellers/${item.sellerId}`)} className="hover:underline text-left">
                      {item.seller}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-[#5A5047] font-medium">{item.businessName}</td>
                  <td className="py-3.5 px-4 text-[#5A5047]">{item.sellerId}</td>
                  <td className="py-3.5 px-4 text-[#1A1612]">{item.products}</td>
                  <td className="py-3.5 px-4 text-[#1A1612]">{item.orders}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{item.revenue}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1612]">{item.rating}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      item.verification === 'Approved' 
                        ? 'bg-[#E2F3E7] text-[#1E7238]' 
                        : 'bg-[#FEF3D6] text-[#8A6100]'
                    }`}>
                      {item.verification}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      item.status === 'Active' 
                        ? 'bg-[#E2F3E7] text-[#1E7238]' 
                        : 'bg-[#FEF3D6] text-[#8A6100]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/sellers/${item.sellerId}`)}
                        className="px-3 py-1.5 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]"
                      >
                        View
                      </button>
                      {item.status === 'Active' ? (
                        <button className="px-3 py-1.5 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                          Suspend
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-white border border-[#EAE3DA] text-[#1A1612] font-semibold rounded-lg hover:bg-[#FAF6F0] text-[11px]">
                          Review
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