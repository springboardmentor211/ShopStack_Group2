import { useSelector } from 'react-redux';

export function useCurrentWarehouse() {
  const profile = useSelector((state) => state.warehouse.core.profile);
  const status = useSelector((state) => state.warehouse.core.status);
  const error = useSelector((state) => state.warehouse.core.error);

  return { warehouse: profile, warehouseId: profile?.warehouseId, status, error };
}
