import { setAuthTokenGetter } from './http';
import { API_BASE_URL, USE_MOCK } from './config';
import { getWarehouseSession, setWarehouseSession } from './warehouseSession';

let token = null;

export async function initDevAuth() {
  const session = getWarehouseSession();
  if (session?.token) {
    setAuthTokenGetter(() => session.token);
    return;
  }
  if (USE_MOCK) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/dev-token?warehouseId=WH-NORTH`, { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    token = data.accessToken;
    setAuthTokenGetter(() => token);
  } catch {
    return;
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
