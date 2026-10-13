import { setAuthTokenGetter } from './http';
import { API_BASE_URL, USE_MOCK } from './config';

let token = null;

export async function initDevAuth() {
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