import { useDispatch, useSelector } from 'react-redux';
import { selectDashboard } from '../store/selectors/warehouseSelectors';
import { loadWarehouseData } from '../store/slices/warehouseSlice';
import { useCurrentWarehouse } from './useCurrentWarehouse';

export function useDashboard() {
  const dispatch = useDispatch();
  const { warehouseId } = useCurrentWarehouse();
  const data = useSelector(selectDashboard);
  const lastSyncedAt = useSelector((state) => state.warehouse.core.lastSyncedAt);
  const loaded = useSelector((state) => state.warehouse.core.loaded);
  const inventoryStatus = useSelector((state) => state.warehouse.inventory.status);
  const summaryStatus = useSelector((state) => state.warehouse.orderSummary.status);
  const receivingStatus = useSelector((state) => state.warehouse.receiving.status);
  const movementStatus = useSelector((state) => state.warehouse.movement.status);
  const inventoryError = useSelector((state) => state.warehouse.inventory.error);
  const summaryError = useSelector((state) => state.warehouse.orderSummary.error);
  const receivingError = useSelector((state) => state.warehouse.receiving.error);
  const movementError = useSelector((state) => state.warehouse.movement.error);
  const loading = !loaded;
  const failed = [inventoryStatus, summaryStatus, receivingStatus, movementStatus].includes('failed');
  const error = inventoryError || summaryError || receivingError || movementError || null;

  function reload() {
    if (warehouseId) dispatch(loadWarehouseData(warehouseId));
  }

  return { ...data, lastSyncedAt, loading, failed, error, reload };
}