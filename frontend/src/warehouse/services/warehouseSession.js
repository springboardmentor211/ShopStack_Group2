const KEY = 'shopstack_warehouse_session';

export function getWarehouseSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function setWarehouseSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    return;
  }
}

export function clearWarehouseSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    return;
  }
}

export function isWarehouseLoggedIn() {
  const session = getWarehouseSession();
  return Boolean(session && session.token);
}
