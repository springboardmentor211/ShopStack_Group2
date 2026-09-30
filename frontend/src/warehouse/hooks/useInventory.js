import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, setFilter } from '../store/slices/inventorySlice';
import { selectBinZones, selectInventoryCategories } from '../store/selectors/warehouseSelectors';
import { useCurrentWarehouse } from './useCurrentWarehouse';

export function useInventory() {
  const dispatch = useDispatch();
  const { warehouseId } = useCurrentWarehouse();
  const { items, status, error, filters } = useSelector((state) => state.warehouse.inventory);
  const categories = useSelector(selectInventoryCategories);
  const zones = useSelector(selectBinZones);

  function updateFilter(key, value) {
    dispatch(setFilter({ key, value }));
  }

  function reload() {
    if (warehouseId) dispatch(fetchInventory(warehouseId));
  }

  return { items, status, error, filters, categories, zones, updateFilter, reload };
}
