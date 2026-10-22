import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <button className="p-2 text-gray-600 hover:bg-gray-200/50 rounded-lg">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-80">
          <input 
            type="text" 
            placeholder="Search orders, users, sellers or products..." 
            className="w-full bg-white border border-[#EAE3DA] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-600 shadow-sm placeholder:text-gray-400"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Notification Bell Icon */}
        <button className="p-2 bg-white rounded-xl border border-[#EAE3DA] text-gray-600 hover:bg-gray-50 shadow-sm relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-[#EAE3DA] shadow-sm">
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="text-xs">
            <p className="font-bold text-gray-900 leading-tight">Hi, Admin</p>
            <p className="text-[10px] text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}