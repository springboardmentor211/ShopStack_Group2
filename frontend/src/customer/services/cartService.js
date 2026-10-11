import api from "../../shared/api/client";

const toCart = (data) => ({
  items: (data?.items || []).map((item) => ({
    id: item.productId,
    quantity: item.quantity,
    name: item.productName,
    unitPrice: Number(item.unitPrice),
    imageUrl: item.imageUrl || null,
  })),
});

// GET /customers/{id}/cart
export const fetchCart = async (customerId) =>
  toCart((await api.get(`/customers/${customerId}/cart`)).data);

// POST /customers/{id}/cart/items  (adds to the existing quantity)
export const addCartItem = async (customerId, productId, quantity) =>
  toCart(
    (await api.post(`/customers/${customerId}/cart/items`, { productId, quantity }))
      .data
  );

// DELETE /customers/{id}/cart/items/{productId}
export const removeCartItem = async (customerId, productId) =>
  toCart((await api.delete(`/customers/${customerId}/cart/items/${productId}`)).data);

// Change the quantity of an item.
// Uses PUT /customers/{id}/cart/items/{productId} when the backend has it.
// Until then, falls back to remove + add so the + and - buttons still work.
let putSupported = false;

export const setCartItemQuantity = async (customerId, productId, current, wanted) => {
  if (putSupported !== false) {
    try {
      const { data } = await api.put(
        `/customers/${customerId}/cart/items/${productId}`,
        { quantity: wanted }
      );
      putSupported = true;
      return toCart(data);
    } catch (error) {
      const status = error.response?.status;
      if (status === 404 || status === 405) putSupported = false;
      else throw error;
    }
  }

  if (wanted > current) return addCartItem(customerId, productId, wanted - current);

  await api.delete(`/customers/${customerId}/cart/items/${productId}`);
  return addCartItem(customerId, productId, wanted);
};
