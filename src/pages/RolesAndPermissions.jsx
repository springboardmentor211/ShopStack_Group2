import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Customers',
  'Sellers',
  'Warehouses',
  'Orders',
  'Catalog',
  'Payments',
  'Returns',
  'Logistics',
  'Reports',
  'Users & Roles',
  'Settings',
];

const INITIAL_PERMISSIONS = {
  Customers: { View: true, Create: false, Edit: true, Approve: false, Manage: false },
  Sellers: { View: true, Create: false, Edit: true, Approve: false, Manage: false },
  Warehouses: { View: true, Create: false, Edit: true, Approve: false, Manage: false },
  Orders: { View: true, Create: false, Edit: true, Approve: false, Manage: false },
  Catalog: { View: true, Create: false, Edit: true, Approve: false, Manage: false },
  Payments: { View: true, Create: false, Edit: false, Approve: false, Manage: false },
  Returns: { View: true, Create: false, Edit: false, Approve: false, Manage: false },
  Logistics: { View: true, Create: false, Edit: false, Approve: false, Manage: false },
  Reports: { View: true, Create: false, Edit: false, Approve: false, Manage: false },
  'Users & Roles': { View: true, Create: false, Edit: false, Approve: false, Manage: false },
  Settings: { View: true, Create: false, Edit: false, Approve: false, Manage: false },
};

export default function RolesAndPermissions() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Super Admin');
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);

  const handleCheckboxChange = (category, action) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [action]: !prev[category][action],
      },
    }));
  };

  const handleSave = () => {
    alert('Permissions saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 text-[#1a1612] w-full max-w-full">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <button
            onClick={() => navigate('/roles')}
            className="text-xs font-semibold text-[#8c827a] hover:text-[#1a1612] transition-colors mb-1 inline-block cursor-pointer"
          >
            ← Back to Users & Roles
          </button>
          <h1 className="text-3xl font-bold text-[#1a1612]">Roles & Permissions</h1>
          <p className="text-xs text-[#8c827a] mt-1">
            Review and adjust access by role.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#1a1612] text-white hover:bg-[#2d2722] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          Save Permissions
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white p-6 rounded-2xl border border-[#eae3da] shadow-2xs space-y-6">
        {/* Role Selector Dropdown */}
        <div>
          <label className="text-xs font-semibold text-[#8c827a] block mb-2">
            Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-white border border-[#eae3da] rounded-xl px-4 py-2.5 text-xs text-[#1a1612] font-medium outline-none cursor-pointer focus:border-[#d8ba78]"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Finance Admin">Finance Admin</option>
            <option value="Support Admin">Support Admin</option>
            <option value="Warehouse Manager">Warehouse Manager</option>
          </select>
        </div>

        <p className="text-[11px] text-[#8c827a]">
          Changes in this prototype affect only the current session. Critical changes require confirmation.
        </p>

        {/* Permissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#eae3da] text-xs font-bold text-[#1a1612]">
                <th className="py-3 px-2 w-2/5">Permission category</th>
                <th className="py-3 px-2 text-center">View</th>
                <th className="py-3 px-2 text-center">Create</th>
                <th className="py-3 px-2 text-center">Edit</th>
                <th className="py-3 px-2 text-center">Approve</th>
                <th className="py-3 px-2 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede6] text-xs">
              {CATEGORIES.map((category) => (
                <tr key={category} className="hover:bg-[#fcf8f2]/50 transition">
                  <td className="py-3.5 px-2 font-bold text-[#1a1612]">
                    {category}
                  </td>
                  {['View', 'Create', 'Edit', 'Approve', 'Manage'].map((action) => (
                    <td key={action} className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[category][action]}
                        onChange={() => handleCheckboxChange(category, action)}
                        className="w-4 h-4 rounded border-[#c2b7ad] text-[#bfa15f] accent-[#bfa15f] cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}