import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User } from 'lucide-react';
import { setFilter as setInventoryFilter } from '../../store/slices/inventorySlice';
import { resetWarehouse } from '../../store/actions';
import { selectNotifications } from '../../store/selectors/warehouseSelectors';
import { useWarehouseJump } from '../../hooks/useWarehouseJump';

const PAGE_TITLES = {
  '/warehouse': 'Dashboard',
  '/warehouse/dashboard': 'Dashboard',
  '/warehouse/receiving': 'Receiving',
  '/warehouse/inventory': 'Inventory',
  '/warehouse/movement': 'Stock Movement',
  '/warehouse/orders': 'Orders',
  '/warehouse/picking': 'Picking, Packing & Outbound',
  '/warehouse/reports': 'Reports & Export',
};

export default function Header({ warehouse, onOpenSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const jump = useWarehouseJump();

  const search = useSelector((state) => state.warehouse.inventory.filters.search);
  const alerts = useSelector(selectNotifications);

  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggedOutNote, setLoggedOutNote] = useState(false);

  const notifRef = useRef(null);
  const accountRef = useRef(null);
  const logoutTimer = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(logoutTimer.current);
    };
  }, []);

  function handleSearchChange(value) {
    dispatch(setInventoryFilter({ key: 'search', value }));
    if (location.pathname !== '/warehouse/inventory') navigate('/warehouse/inventory');
  }

  function handleAlert(alert) {
    setNotifOpen(false);
    jump.follow(alert.jump);
  }

  function handleLogout() {
    dispatch(resetWarehouse());
    setLoggedOutNote(true);
    logoutTimer.current = setTimeout(() => {
      setLoggedOutNote(false);
      setAccountOpen(false);
    }, 1400);
  }

  const path = location.pathname.replace(/\/+$/, '') || '/warehouse';
  const title = PAGE_TITLES[path] || 'Warehouse';

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8DFC8] bg-[#F5EFE0]/95 px-5 py-4 backdrop-blur lg:px-8">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="rounded-xl border border-[#E8DFC8] bg-white p-2.5 text-[#8F6739] lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <p className="wh-editorial text-lg font-bold leading-tight text-[#1A1A1A]">{title}</p>
            <p className="text-xs text-[#746D62]">{warehouse?.warehouseName || 'Warehouse'} · Live operations</p>
          </div>
        </div>

        <div className="hidden justify-center sm:flex">
          <div className="relative w-full max-w-[520px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F6739]" />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="SKU or product lookup"
              className="w-full rounded-full border border-[#E8DFC8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#1A1A1A] focus:border-[#8F6739] focus:outline-none focus:ring-2 focus:ring-[#8F6739]/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                setAccountOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="rounded-full border border-[#E8DFC8] bg-white p-2.5 text-[#8F6739] shadow-sm"
            >
              <Bell className="h-4 w-4" />
            </button>
            {alerts.length > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#B5423B] px-1 text-center text-[10px] font-bold leading-[18px] text-white">
                {alerts.length}
              </span>
            )}
            {notifOpen && (
              <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-[#E8DFC8] bg-white p-4 shadow-[0_14px_34px_rgba(85,62,32,.18)]">
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {alerts.length} warehouse {alerts.length === 1 ? 'notice' : 'notices'}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {alerts.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => handleAlert(a)}
                        className="w-full rounded-lg py-1.5 text-left text-xs leading-5 text-[#746D62] hover:bg-[#FCF9F2]"
                      >
                        {a.text}
                      </button>
                    </li>
                  ))}
                  {alerts.length === 0 && <li className="py-1.5 text-xs text-[#746D62]">Nothing needs attention.</li>}
                </ul>
              </div>
            )}
          </div>

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => {
                setAccountOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="Account"
              aria-expanded={accountOpen}
              className="rounded-full bg-[#8F6739] p-2.5 text-white shadow-sm"
            >
              <User className="h-4 w-4" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl border border-[#E8DFC8] bg-white p-4 shadow-[0_14px_34px_rgba(85,62,32,.18)]">
                {loggedOutNote ? (
                  <p className="text-sm font-semibold text-[#337454]">Logged out.</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{warehouse?.ownerName || 'Warehouse owner'}</p>
                    <p className="mt-1 text-xs text-[#746D62]">{warehouse?.role || ''}</p>
                    <div className="mt-3 space-y-1 border-t border-[#E8DFC8] pt-3">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-[#B5423B] hover:bg-[#FBE9E7]"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
