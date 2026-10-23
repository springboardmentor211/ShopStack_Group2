import { setAuthTokenGetter } from './http';
import { API_BASE_URL } from './config';
import { getWarehouseSession, setWarehouseSession } from './warehouseSession';

let token = null;

export async function initDevAuth(warehouseId = 'WH-NORTH') {
  const session = getWarehouseSession();
  if (session?.token && session.token !== 'mock-session') {
    setAuthTokenGetter(() => session.token);
    return true;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/dev-token?warehouseId=${encodeURIComponent(warehouseId)}`, { method: 'POST' });
    if (!res.ok) return false;
    const data = await res.json();
    token = data.accessToken;
    setAuthTokenGetter(() => token);
    return true;
  } catch {
    return false;
  }
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
