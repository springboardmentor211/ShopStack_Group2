<<<<<<< HEAD
import api from "../../shared/api/client";

// GET /customers/{id}/wishlist -> list of product ids
export const fetchWishlist = async (customerId) => {
  const { data } = await api.get(`/customers/${customerId}/wishlist`);
  return (Array.isArray(data) ? data : []).map((item) => item.productId);
};

// POST /customers/{id}/wishlist
// customerId is also sent in the body because the current backend validates it
// there (it is the same id as in the URL).
export const addWishlistItem = (customerId, productId) =>
  api.post(`/customers/${customerId}/wishlist`, { customerId, productId });

// DELETE /customers/{id}/wishlist/products/{productId}
export const removeWishlistItem = (customerId, productId) =>
  api.delete(`/customers/${customerId}/wishlist/products/${productId}`);
=======
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
>>>>>>> origin/warehouse-module
