import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

export default function AddWarehouse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warehouseName: '',
    warehouseCode: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    contactNumber: '',
    manager: '',
    capacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Warehouse created successfully!');
    navigate('/warehouses');
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
              Overview &gt; Warehouses &gt; <span className="font-semibold text-[#1A1612]">Add Warehouse</span>
            </div>
            <h1 className="text-xl font-bold text-[#1A1612]">Add Warehouse</h1>
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

      {/* Back Link Header */}
      <div className="mb-6">
        <Link to="/warehouses" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1612] hover:underline mb-2">
          ← Back to Warehouses
        </Link>
        <h2 className="text-2xl font-bold text-[#1A1612]">Add Warehouse</h2>
        <p className="text-xs text-[#7A7067] mt-0.5">Configure an admin-managed warehouse record.</p>
      </div>

      {/* Add Warehouse Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#EAE3DA] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Warehouse Name
            </label>
            <input
              type="text"
              name="warehouseName"
              required
              value={formData.warehouseName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border-2 border-[#C39A6B] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:ring-1 focus:ring-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Warehouse Code
            </label>
            <input
              type="text"
              name="warehouseCode"
              required
              value={formData.warehouseCode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              State
            </label>
            <input
              type="text"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              PIN Code
            </label>
            <input
              type="text"
              name="pinCode"
              required
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Manager
            </label>
            <input
              type="text"
              name="manager"
              required
              value={formData.manager}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
              Capacity
            </label>
            <input
              type="text"
              name="capacity"
              required
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#EAE3DA] rounded-xl text-xs bg-white text-[#1A1612] outline-none focus:border-[#C39A6B]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE3DA]">
          <button
            type="button"
            onClick={() => navigate('/warehouses')}
            className="px-5 py-2 bg-white border border-[#EAE3DA] text-[#1A1612] text-xs font-semibold rounded-xl hover:bg-[#FAF6F0]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#1A1612] text-white text-xs font-semibold rounded-xl hover:bg-[#2D241E]"
          >
            Create Warehouse
          </button>
        </div>
      </form>
    </div>
  );
}