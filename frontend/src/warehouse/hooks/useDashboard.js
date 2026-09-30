import { useSelector } from 'react-redux';
import { selectDashboard } from '../store/selectors/warehouseSelectors';

export function useDashboard() {
  const data = useSelector(selectDashboard);
  const lastSyncedAt = useSelector((state) => state.warehouse.core.lastSyncedAt);
  const inventoryStatus = useSelector((state) => state.warehouse.inventory.status);
  const summaryStatus = useSelector((state) => state.warehouse.orderSummary.status);
  const loading =
    inventoryStatus === 'idle' ||
    summaryStatus === 'idle' ||
    ((inventoryStatus === 'loading' || summaryStatus === 'loading') && !lastSyncedAt);

  return { ...data, lastSyncedAt, loading };
}
