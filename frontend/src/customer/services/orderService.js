import api from "../../shared/api/client";
import { USE_MOCK } from "../../warehouse/services/config";

const DEMO_ORDERS_KEY = "shopstack_demo_orders";

const readDemoOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem(DEMO_ORDERS_KEY) || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
};

// POST /customers/{id}/orders  (creates an order from the cart and empties it)
export const createOrder = async (customerId, shippingAddress, cartItems, totalAmount, customer, paymentMethod) => {
  if (USE_MOCK) {
    const id = `DEMO-${Date.now()}`;
    const order = {
      id,
      orderNumber: id,
      status: "PENDING",
      placedAt: new Date().toISOString(),
      warehouse: "North Hub",
      deliveryDate: null,
      paymentStatus: paymentMethod === "CASH_ON_DELIVERY" ? "Cash on delivery" : "Verified",
      customer: {
        name: customer?.name || `Customer ${customerId}`,
        city: customer?.city || "",
        address: shippingAddress,
        phone: customer?.phone || "",
      },
      items: cartItems.map(({ id: productId, quantity, product }) => ({
        sku: `PRD-${productId}`,
        name: product.name,
        variant: "Standard",
        image: product.image,
        tint: "#f1f0ec",
        bin: "Unassigned",
        quantity,
        stock: product.stock ?? 0,
        vendorName: "ShopStack",
      })),
      totalAmount,
    };

    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([order, ...readDemoOrders()]));
    localStorage.removeItem(`shopstack_demo_cart_${customerId}`);
    return order;
  }

  return (await api.post(`/customers/${customerId}/orders`, { shippingAddress })).data;
};

// POST /payments
export const createPayment = async (orderId, paymentMethod) => {
  if (USE_MOCK) return { id: `DEMO-PAY-${Date.now()}`, orderId, paymentMethod };
  return (await api.post("/payments", { orderId, paymentMethod })).data;
};

// POST /payments/{id}/process  (simulated payment result)
export const processPayment = async (paymentId, success = true) => {
  if (USE_MOCK) return { id: paymentId, success };
  return (
    await api.post(`/payments/${paymentId}/process`, {
      transactionId: `TXN${Date.now()}`,
      success,
    })
  ).data;
};
