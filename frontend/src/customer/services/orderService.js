import api from "../../shared/api/client";

// POST /customers/{id}/orders  (creates an order from the cart and empties it)
export const createOrder = async (customerId, shippingAddress) =>
  (await api.post(`/customers/${customerId}/orders`, { shippingAddress })).data;

// POST /payments
export const createPayment = async (orderId, paymentMethod) =>
  (await api.post("/payments", { orderId, paymentMethod })).data;

// POST /payments/{id}/process  (simulated payment result)
export const processPayment = async (paymentId, success = true) =>
  (
    await api.post(`/payments/${paymentId}/process`, {
      transactionId: `TXN${Date.now()}`,
      success,
    })
  ).data;
