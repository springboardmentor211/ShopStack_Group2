import React from 'react';
import { Link } from 'react-router-dom';

export default function Overview() {
  return (
    <div>
      {/* Top Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-[#888]">
            Shop360 / <Link to="/" className="hover:underline">Admin Console</Link>
          </div>
          <div className="text-xl font-bold text-[#1a1612]">Admin Overview</div>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Search orders, users, sellers or products..." 
            className="px-4 py-2 border border-[#e2dacd] rounded-md bg-white w-[280px] text-xs outline-none"
          />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1a1612] text-white rounded-full flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div className="text-xs">
              <strong>Hi, Admin</strong><br />
              <span className="text-[#777]">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <div className="text-xs text-[#777] mb-2">GMV</div>
          <div className="text-2xl font-bold text-[#1a1612]">₹1,25,45,320</div>
          <div className="text-[11px] text-[#2e7d32] mt-1">↑ 12.1% vs last month</div>
        </div>
        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <div className="text-xs text-[#777] mb-2">Total Orders</div>
          <div className="text-2xl font-bold text-[#1a1612]">2,456</div>
          <div className="text-[11px] text-[#2e7d32] mt-1">↑ 8.2% vs last month</div>
        </div>
        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <div className="text-xs text-[#777] mb-2">Active Sellers</div>
          <div className="text-2xl font-bold text-[#1a1612]">1,256</div>
          <div className="text-[11px] text-[#2e7d32] mt-1">↑ 5.1% vs last month</div>
        </div>
        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <div className="text-xs text-[#777] mb-2">Customers</div>
          <div className="text-2xl font-bold text-[#1a1612]">12,540</div>
          <div className="text-[11px] text-[#2e7d32] mt-1">↑ 6.8% vs last month</div>
        </div>
      </div>

      {/* Sales & Orders Section */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="col-span-2 bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Sales Overview</h3>
          <p className="text-[11px] text-[#777] mb-2">Revenue trend - Last 7 days</p>
          <div className="flex items-end justify-between h-40 pt-5">
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '60px' }}></div>Mon</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '80px' }}></div>Tue</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '70px' }}></div>Wed</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '100px' }}></div>Thu</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '90px' }}></div>Fri</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '130px' }}></div>Sat</div>
            <div className="flex flex-col items-center gap-2 text-[11px] text-[#777]"><div className="w-7 bg-[#cbb282] rounded-sm" style={{ height: '120px' }}></div>Sun</div>
          </div>
        </div>

        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Orders Overview</h3>
          <ul className="mt-3 divide-y divide-[#f5efeb] text-xs">
            <li className="py-1.5 flex justify-between"><span>Pending</span> <strong>89</strong></li>
            <li className="py-1.5 flex justify-between"><span>Confirmed</span> <strong>124</strong></li>
            <li className="py-1.5 flex justify-between"><span>Processing</span> <strong>350</strong></li>
            <li className="py-1.5 flex justify-between"><span>Shipped</span> <strong>292</strong></li>
            <li className="py-1.5 flex justify-between"><span>Delivered</span> <strong>1456</strong></li>
            <li className="py-1.5 flex justify-between"><span>Cancelled</span> <strong>60</strong></li>
            <li className="py-1.5 flex justify-between"><span>Returned</span> <strong>69</strong></li>
          </ul>
        </div>
      </div>

      {/* Marketplace & Operational Section */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="col-span-2 bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Marketplace Overview</h3>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div><div className="text-lg font-bold">18,420</div><div className="text-xs text-[#777]">Total Products</div></div>
            <div><div className="text-lg font-bold">16,980</div><div className="text-xs text-[#777]">Active Products</div></div>
            <div><div className="text-lg font-bold">386</div><div className="text-xs text-[#777]">Out of Stock</div></div>
            <div><div className="text-lg font-bold">72</div><div className="text-xs text-[#777]">Pending Reviews</div></div>
          </div>
        </div>

        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Operational Summary</h3>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div><div className="text-lg font-bold">24</div><div className="text-xs text-[#777]">Seller Applications</div></div>
            <div><div className="text-lg font-bold">18</div><div className="text-xs text-[#777]">Returns Review</div></div>
            <div><div className="text-lg font-bold">7</div><div className="text-xs text-[#777]">Payment Issues</div></div>
            <div><div className="text-lg font-bold">12</div><div className="text-xs text-[#777]">Delayed Shipments</div></div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Recent Activity</h3>
          <ul className="mt-2 divide-y divide-[#f5efeb] text-xs">
            <li className="py-2.5 flex justify-between"><span>New Seller Approved</span> <span className="text-[#888]">09:42</span></li>
            <li className="py-2.5 flex justify-between"><span>Order Refunded</span> <span className="text-[#888]">09:15</span></li>
            <li className="py-2.5 flex justify-between"><span>Warehouse Added</span> <span className="text-[#888]">Yesterday</span></li>
            <li className="py-2.5 flex justify-between"><span>Product Suspended</span> <span className="text-[#888]">Yesterday</span></li>
            <li className="py-2.5 flex justify-between"><span>Admin Role Changed</span> <span className="text-[#888]">27 Sep</span></li>
          </ul>
        </div>

        <div className="bg-white border border-[#eae2d5] rounded-lg p-4">
          <h3 className="font-bold text-sm text-[#1a1612]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="p-2.5 bg-white border border-[#ded5c6] rounded text-xs font-bold text-[#444] hover:bg-[#f5efeb]">Review Sellers</button>
            <button className="p-2.5 bg-white border border-[#ded5c6] rounded text-xs font-bold text-[#444] hover:bg-[#f5efeb]">View Orders</button>
            <button className="p-2.5 bg-white border border-[#ded5c6] rounded text-xs font-bold text-[#444] hover:bg-[#f5efeb]">Resolve Disputes</button>
            <button className="p-2.5 bg-white border border-[#ded5c6] rounded text-xs font-bold text-[#444] hover:bg-[#f5efeb]">Manage Users</button>
          </div>
        </div>
      </div>
    </div>
  );
}