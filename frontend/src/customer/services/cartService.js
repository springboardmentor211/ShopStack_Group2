import api from "../../shared/api/client";
import { USE_MOCK } from "../../warehouse/services/config";
import fallbackProducts from "../../shared/data/products";

const mockCartKey = (customerId) => `shopstack_demo_cart_${customerId}`;

const readMockCart = (customerId) => {
  try {
    const items = JSON.parse(localStorage.getItem(mockCartKey(customerId)) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const writeMockCart = (customerId, items) => {
  localStorage.setItem(mockCartKey(customerId), JSON.stringify(items));
  return { items };
};

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
export const fetchCart = async (customerId) => {
  if (USE_MOCK) return { items: readMockCart(customerId) };
  return toCart((await api.get(`/customers/${customerId}/cart`)).data);
};

// POST /customers/{id}/cart/items  (adds to the existing quantity)
export const addCartItem = async (customerId, productId, quantity, product) => {
  if (USE_MOCK) {
    const items = readMockCart(customerId);
    const existing = items.find((item) => String(item.id) === String(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      const catalogProduct = product || fallbackProducts.find((item) => String(item.id) === String(productId));
      items.push({
        id: productId,
        quantity,
        name: catalogProduct?.name || "ShopStack product",
        unitPrice: Number(catalogProduct?.price || 0),
        imageUrl: catalogProduct?.image || catalogProduct?.imageUrl || null,
      });
    }
    return writeMockCart(customerId, items);
  }

  return toCart(
    (await api.post(`/customers/${customerId}/cart/items`, { productId, quantity }))
      .data
  );
};

// DELETE /customers/{id}/cart/items/{productId}
export const removeCartItem = async (customerId, productId) => {
  if (USE_MOCK) {
    const items = readMockCart(customerId).filter((item) => String(item.id) !== String(productId));
    return writeMockCart(customerId, items);
  }
  return toCart((await api.delete(`/customers/${customerId}/cart/items/${productId}`)).data);
};

// Change the quantity of an item.
// Uses PUT /customers/{id}/cart/items/{productId} when the backend has it.
// Until then, falls back to remove + add so the + and - buttons still work.
let putSupported = false;

export const setCartItemQuantity = async (customerId, productId, current, wanted) => {
  if (USE_MOCK) {
    const items = readMockCart(customerId).map((item) =>
      String(item.id) === String(productId) ? { ...item, quantity: wanted } : item
    );
    return writeMockCart(customerId, items);
  }

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
