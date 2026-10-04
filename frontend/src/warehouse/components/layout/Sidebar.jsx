import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowDownToLine, Boxes, Move, Package, Truck, FileText, X, Warehouse } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/warehouse/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Vendor Side',
    items: [
      { label: 'Receiving', path: '/warehouse/receiving', icon: ArrowDownToLine, badgeKey: 'receiving' },
      { label: 'Inventory', path: '/warehouse/inventory', icon: Boxes, badgeKey: 'inventory', badgeTone: 'alert' },
      { label: 'Stock Movement', path: '/warehouse/movement', icon: Move },
    ],
  },
  {
    label: 'Customer Side',
    items: [
      { label: 'Orders', path: '/warehouse/orders', icon: Package },
      { label: 'Picking, Packing & Outbound', path: '/warehouse/picking', icon: Truck },
    ],
  },
  {
    label: 'Operations',
    items: [{ label: 'Reports & Export', path: '/warehouse/reports', icon: FileText }],
  },
];

export default function Sidebar({ counts = {}, ownerName = '', role = '', isOpen = false, onClose = () => {} }) {
  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}

      <aside
        className={`fixed z-50 flex h-screen w-[248px] flex-shrink-0 flex-col border-r border-[#E8DFC8] bg-white transition-[transform,visibility] duration-200 lg:visible lg:sticky lg:top-0 lg:z-0 lg:translate-x-0 ${
          isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E8DFC8] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8F6739] text-white">
              <Warehouse className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="wh-editorial text-sm font-bold leading-tight text-[#1A1A1A]">Shop360</p>
              <p className="text-[11px] text-[#746D62]">Warehouse Console</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4 text-[#746D62]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mt-5 first:mt-0">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a89a80]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const badgeValue = item.badgeKey ? counts[item.badgeKey] : 0;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                        isActive ? 'bg-[#FBF4E7] text-[#68471f]' : 'text-[#1A1A1A] hover:bg-[#FCF9F2]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-[#8F6739]" />
                    <span>{item.label}</span>
                    {badgeValue > 0 && (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                          item.badgeTone === 'alert' ? 'bg-[#B5423B]' : 'bg-[#8F6739]'
                        }`}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E8DFC8] px-5 py-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">{ownerName}</p>
          <p className="text-xs text-[#746D62]">{role}</p>
        </div>
      </aside>
    </>
  );
}
