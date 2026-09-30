import { useDispatch, useSelector } from 'react-redux';
import { fetchInbound, receiveShipment, selectAsn, setFilter } from '../store/slices/receivingSlice';
import { useCurrentWarehouse } from './useCurrentWarehouse';

export function useReceiving() {
  const dispatch = useDispatch();
  const { warehouseId } = useCurrentWarehouse();
  const { items, bins, status, error, selectedId, filters, isReceiving, receiveError } = useSelector(
    (state) => state.warehouse.receiving
  );
  const inventoryItems = useSelector((state) => state.warehouse.inventory.items);

  function select(id) {
    dispatch(selectAsn(id));
  }

  function updateFilter(key, value) {
    dispatch(setFilter({ key, value }));
  }

  async function receive(id, bin) {
    const action = await dispatch(receiveShipment({ warehouseId, id, bin }));
    return receiveShipment.fulfilled.match(action);
  }

  function reload() {
    if (warehouseId) dispatch(fetchInbound(warehouseId));
  }

  return {
    items,
    bins,
    status,
    error,
    selectedId,
    filters,
    inventoryItems,
    isReceiving,
    receiveError,
    select,
    updateFilter,
    receive,
    reload,
  };
}
