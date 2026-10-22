// All cart storage goes through this file.
// Right now it saves to the browser (localStorage). When the backend is ready,
// replace the bodies of these functions with Axios calls (e.g. GET /api/cart)
// and the rest of the app will not need to change.
const KEY = "shopstack_cart";

export const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage full or blocked: ignore, cart still works for this session
  }
};
