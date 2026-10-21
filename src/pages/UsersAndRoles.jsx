import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Admin Operations',
    email: 'operations@shop360.example',
    role: 'Super Admin',
    location: 'Marketplace',
    status: 'Active',
    lastActive: 'Today',
  },
  {
    id: 2,
    name: 'Sana Desai',
    email: 'sana@shop360.example',
    role: 'Finance Admin',
    location: 'Finance',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 3,
    name: 'Tara Menon',
    email: 'tara@shop360.example',
    role: 'Support Admin',
    location: 'Customer Support',
    status: 'Inactive',
    lastActive: '11 Sep 2026',
  },
];

export default function UsersAndRoles() {
  const navigate = useNavigate();

  // State Management
  const [activeTab, setActiveTab] = useState('Admin Users');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [usersList, setUsersList] = useState(INITIAL_USERS);

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'view' | 'changeRole' | 'toggleStatus' | null

  // Filter Logic
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Status' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleOpenModal = (user, type) => {
    setSelectedUser(user);
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setActiveModal(null);
  };

  const handleConfirmRoleChange = () => {
    if (selectedUser) {
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: u.role === 'Super Admin' ? 'Support Admin' : 'Super Admin' }
            : u
        )
      );
    }
    handleCloseModal();
  };

  const handleConfirmToggleStatus = () => {
    if (selectedUser) {
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
            : u
        )
      );
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full relative">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent pb-2">
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="text-xs text-[#8c827a]">Overview › </span>
            <span className="text-xs font-semibold text-[#1a1612]">Users & Roles</span>
            <h2 className="text-xl font-bold text-[#1a1612]">Users & Roles</h2>
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
          <button className="p-2.5 rounded-xl border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] shadow-2xs cursor-pointer">
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

      {/* Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] transition-colors mb-1 inline-block cursor-pointer"
          >
            ← Back to Overview
          </button>
          <h1 className="text-3xl font-bold text-[#1a1612]">Users & Roles</h1>
          <p className="text-xs text-[#8c827a] mt-1">
            Invite staff and govern access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer">
            Invite User
          </button>
          <button
            onClick={() => navigate('/roles/manage')}
            className="px-4 py-2 bg-white border border-[#eae3da] hover:bg-[#faf7f2] rounded-xl text-xs font-semibold text-[#1a1612] transition-all shadow-2xs cursor-pointer"
          >
            Manage Roles
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-2 border-b border-[#eae3da] pb-3">
        {['Admin Users', 'Warehouse Staff', 'Roles', 'Invitations'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Roles') {
                navigate('/roles/manage');
              }
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#f5ebd9] text-[#1a1612]'
                : 'text-[#8c827a] hover:text-[#1a1612] hover:bg-[#fcf8f2]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#eae3da] shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Search Users & Roles
            </label>
            <input
              type="text"
              placeholder="Name, email or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none placeholder-[#b8aeb0]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8c827a] block mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-[#eae3da] rounded-xl px-3 py-2 text-xs text-[#1a1612] outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#f9f5ef] rounded-2xl border border-[#eae3da] overflow-x-auto shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#f5ebd9]/60 border-b border-[#eae3da] text-[11px] font-bold text-[#8c827a] whitespace-nowrap">
              <th className="py-4 px-4 pl-6">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Role</th>
              <th className="py-4 px-4">Assigned Location / Department</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Last Active</th>
              <th className="py-4 px-4 pr-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#eae3da] text-xs">
            {filteredUsers.map((row) => (
              <tr key={row.id} className="hover:bg-[#fcf8f2]/50 transition">
                <td className="py-4 px-4 pl-6 font-semibold text-[#1a1612] whitespace-nowrap">
                  {row.name}
                </td>
                <td className="py-4 px-4 text-[#70665f] whitespace-nowrap">
                  {row.email}
                </td>
                <td className="py-4 px-4 font-medium text-[#1a1612] whitespace-nowrap">
                  {row.role}
                </td>
                <td className="py-4 px-4 text-[#70665f] whitespace-nowrap">
                  {row.location}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                      row.status === 'Active'
                        ? 'bg-[#e2f3e8] text-[#2d6a4f]'
                        : 'bg-[#fce8e6] text-[#b91c1c]'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#70665f] whitespace-nowrap">
                  {row.lastActive}
                </td>
                <td className="py-4 px-4 pr-6 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(row, 'view')}
                      className="border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] px-3.5 py-1.5 rounded-full font-semibold text-xs transition shadow-2xs cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenModal(row, 'changeRole')}
                      className="border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] px-3.5 py-1.5 rounded-full font-semibold text-xs transition shadow-2xs cursor-pointer"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => handleOpenModal(row, 'toggleStatus')}
                      className="border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] px-3.5 py-1.5 rounded-full font-semibold text-xs transition shadow-2xs cursor-pointer"
                    >
                      {row.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS SECTION ================= */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          
          {/* 1. View Modal (2nd Pic) */}
          {activeModal === 'view' && selectedUser && (
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#eae3da] animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-[#1a1612]">User Details</h3>
              <p className="text-xs text-[#8c827a] leading-relaxed">
                {selectedUser.name} · {selectedUser.email} · {selectedUser.role} · {selectedUser.location} · {selectedUser.status}
              </p>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 2. Change Role Modal (3rd Pic) */}
          {activeModal === 'changeRole' && selectedUser && (
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#eae3da] animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-[#1a1612]">Change Critical Permissions</h3>
              <p className="text-xs text-[#8c827a] leading-relaxed">
                Change access for {selectedUser.name}? This sample action switches between Admin and Support Admin.
              </p>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  className="px-5 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Confirm Role Change
                </button>
              </div>
            </div>
          )}

          {/* 3. Deactivate / Reactivate Modal (4th Pic) */}
          {activeModal === 'toggleStatus' && selectedUser && (
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-[#eae3da] animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-xl font-bold text-[#1a1612]">
                {selectedUser.status === 'Active' ? 'Deactivate Staff' : 'Reactivate Staff'}
              </h3>
              <p className="text-xs text-[#8c827a] leading-relaxed">
                Change {selectedUser.name}'s account status?
              </p>
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 border border-[#eae3da] bg-white text-[#1a1612] hover:bg-[#fcf8f2] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmToggleStatus}
                  className="px-5 py-2 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-2xl text-xs font-semibold transition cursor-pointer"
                >
                  {selectedUser.status === 'Active' ? 'Confirm Deactivation' : 'Confirm Reactivation'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}