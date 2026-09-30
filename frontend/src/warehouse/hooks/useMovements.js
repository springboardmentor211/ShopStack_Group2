import { useDispatch, useSelector } from 'react-redux';
import { fetchMovements } from '../store/slices/movementSlice';
import { useCurrentWarehouse } from './useCurrentWarehouse';

export function useMovements() {
  const dispatch = useDispatch();
  const { warehouseId } = useCurrentWarehouse();
  const { items, status, error } = useSelector((state) => state.warehouse.movement);

  function reload() {
    if (warehouseId) dispatch(fetchMovements(warehouseId));
  }

  return { items, status, error, reload };
}
