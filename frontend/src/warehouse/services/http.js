import { API_BASE_URL } from './config';

let tokenGetter = () => null;
let logoutHandler = null;

export const setAuthTokenGetter = (getter) => {
  tokenGetter = getter;
};

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const runLogout = () => {
  if (logoutHandler) logoutHandler();
};

export async function apiRequest(path, options = {}) {
  const token = tokenGetter();
  const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 401) runLogout();
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const jsonPost = (body) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
