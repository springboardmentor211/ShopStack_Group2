// All wishlist storage goes through this file.
// Currently uses localStorage; swap for Axios calls when the backend is ready.
const KEY = "shopstack_wishlist";

export const loadWishlist = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const saveWishlist = (ids) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors
  }
};
