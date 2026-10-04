import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import { fetchWarehouseProfile, loadWarehouseData } from '../../store/slices/warehouseSlice';
import { resetWarehouseData } from '../../store/actions';
import { selectSidebarCounts } from '../../store/selectors/warehouseSelectors';
import { useCurrentWarehouse } from '../../hooks/useCurrentWarehouse';
import '../../styles/warehouse.css';

const REFRESH_MS = 60000;

export default function WarehouseLayout() {
  const dispatch = useDispatch();
  const { warehouse, warehouseId, status, error } = useCurrentWarehouse();
  const counts = useSelector(selectSidebarCounts);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchWarehouseProfile());
  }, [status, dispatch]);

  useEffect(() => {
    if (!warehouseId) return;
    dispatch(resetWarehouseData());
    dispatch(loadWarehouseData(warehouseId));
  }, [warehouseId, dispatch]);

  useEffect(() => {
    if (!warehouseId) return undefined;
    const timer = setInterval(() => dispatch(loadWarehouseData(warehouseId)), REFRESH_MS);
    return () => clearInterval(timer);
  }, [warehouseId, dispatch]);

  return (
    <div className="wh-root flex min-h-screen bg-[#F5EFE0] text-[#1A1A1A]">
      <Sidebar
        counts={counts}
        ownerName={warehouse?.ownerName || ''}
        role={warehouse?.role || ''}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Header warehouse={warehouse} onOpenSidebar={() => setSidebarOpen(true)} />
        <main>
          {status === 'failed' ? (
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm font-semibold text-[#B5423B]">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => dispatch(fetchWarehouseProfile())}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#B5423B]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
