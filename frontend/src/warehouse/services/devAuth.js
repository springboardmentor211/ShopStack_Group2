import { setAuthTokenGetter } from './http';
import { getWarehouseSession, setWarehouseSession } from './warehouseSession';

export async function initDevAuth() {
  const session = getWarehouseSession();
  if (session?.token) setAuthTokenGetter(() => session.token);
}

export function startWarehouseSession(data) {
  setWarehouseSession({
    token: data.token,
    warehouseId: data.warehouseId,
    name: data.name,
    email: data.email,
  });
  setAuthTokenGetter(() => data.token);
}
