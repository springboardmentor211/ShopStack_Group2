import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummary, { getCartDetails } from "../components/OrderSummary";
<<<<<<< HEAD
import { loadCart } from "../../store/cartSlice";
import { formatPrice } from "../../shared/format";
import { getCustomerId } from "../services/authService";
import { createOrder, createPayment, processPayment } from "../services/orderService";
import { getErrorMessage } from "../../shared/api/client";
import {
  page, card, title, sectionTitle, goldButton, darkButton, backButton, errorText,
} from "../../shared/ui";

const METHODS = [
  { value: "upi", api: "UPI", name: "UPI / Wallet", text: "Pay securely with your preferred UPI app." },
  { value: "card", api: "CREDIT_CARD", name: "Credit or Debit Card", text: "Demo card payment option." },
  { value: "cod", api: "CASH_ON_DELIVERY", name: "Cash on Delivery", text: "Pay when your order arrives." },
=======
import { clearCart } from "../../store/cartSlice";
import { formatPrice } from "../../shared/data/products";
import {
  page, card, title, sectionTitle, goldButton, darkButton, backButton,
} from "../../shared/ui";

const METHODS = [
  { value: "upi", name: "UPI / Wallet", text: "Pay securely with your preferred UPI app." },
  { value: "card", name: "Credit or Debit Card", text: "Demo card payment option." },
  { value: "cod", name: "Cash on Delivery", text: "Pay when your order arrives." },
>>>>>>> origin/warehouse-module
];

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
<<<<<<< HEAD
  const products = useSelector((state) => state.products.items);
  const { items, total } = getCartDetails(cartItems, products);

  const [method, setMethod] = useState(location.state?.payment || "upi");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null); // order saved, payment not finished
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
=======
  const { items, total } = getCartDetails(cartItems);

  const [method, setMethod] = useState(location.state?.payment || "upi");
  const [placedOrder, setPlacedOrder] = useState(null);
>>>>>>> origin/warehouse-module

  // Opened without going through Checkout (e.g. after a refresh).
  if (!location.state && !placedOrder) return <Navigate to="/checkout" replace />;

<<<<<<< HEAD
  const placeOrder = async () => {
    setError("");
    setSubmitting(true);
    const chosen = METHODS.find((item) => item.value === method);

    try {
      // 1. Save the order in the database (this also empties the cart).
      let order = pendingOrder;
      if (!order) {
        const { address, city, pin } = location.state;
        order = await createOrder(getCustomerId(), `${address}, ${city} ${pin}`);
        setPendingOrder(order);
        dispatch(loadCart());
      }

      // 2. Create the payment and, for online methods, complete it.
      const payment = await createPayment(order.id, chosen.api);
      if (chosen.api !== "CASH_ON_DELIVERY") {
        await processPayment(payment.id, true);
      }

      setPlacedOrder({
        id: order.orderNumber || `#${order.id}`,
        total: order.totalAmount ?? total,
        method: chosen.name,
      });
      setPendingOrder(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not complete the payment."));
    } finally {
      setSubmitting(false);
    }
  };

  const emptyCard = (heading) => (
    <div style={{ ...card, textAlign: "center", padding: "50px 40px" }}>
      <h2 style={sectionTitle}>{heading}</h2>
      <button
        type="button"
        onClick={() => navigate("/products")}
        style={{ ...darkButton, width: "auto", padding: "0 28px" }}
      >
        Shop Products
      </button>
    </div>
  );

=======
  const placeOrder = () => {
    // Demo only: no real payment or order is created until the backend exists.
    setPlacedOrder({ id: `SS${Date.now().toString().slice(-8)}`, total });
    dispatch(clearCart());
  };

>>>>>>> origin/warehouse-module
  return (
    <div style={page}>
      <Navbar />

      <main style={{ padding: "35px 40px 70px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {placedOrder ? (
            <div style={{ ...card, textAlign: "center", padding: "50px 40px" }}>
              <h1 style={title}>Order placed</h1>
              <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#716c64" }}>
                Thank you for shopping with Shop360.
              </p>
              <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#211f1b" }}>
<<<<<<< HEAD
                Order {placedOrder.id} · {formatPrice(placedOrder.total)} · {placedOrder.method}
=======
                Order {placedOrder.id} · {formatPrice(placedOrder.total)}
>>>>>>> origin/warehouse-module
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{ ...darkButton, width: "auto", padding: "0 28px" }}
              >
                Continue Shopping
              </button>
            </div>
<<<<<<< HEAD
          ) : items.length === 0 && !pendingOrder ? (
            emptyCard("Your cart is empty")
=======
          ) : items.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: "50px 40px" }}>
              <h2 style={sectionTitle}>Your cart is empty</h2>
              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{ ...darkButton, width: "auto", padding: "0 28px" }}
              >
                Shop Products
              </button>
            </div>
>>>>>>> origin/warehouse-module
          ) : (
            <>
              <button type="button" onClick={() => navigate("/checkout")} style={backButton}>
                ← Back to Checkout
              </button>

              <h1 style={{ ...title, marginBottom: "24px" }}>Secure Payment</h1>

              <div style={{ ...card, marginBottom: "24px" }}>
                <h2 style={sectionTitle}>Choose payment method</h2>

                {METHODS.map((item) => (
                  <label
                    key={item.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px 0",
                      borderBottom: "1px solid #e5d9c9",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={method === item.value}
                      onChange={() => setMethod(item.value)}
                      style={{ accentColor: "#b58243" }}
                    />
                    <span>
                      <span style={{ display: "block", fontSize: "16px", fontWeight: "700", color: "#211f1b" }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: "13px", color: "#716c64" }}>{item.text}</span>
                    </span>
                  </label>
                ))}

<<<<<<< HEAD
                {error && <p style={{ ...errorText, marginTop: "14px" }}>{error}</p>}

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={submitting}
                  style={{ ...goldButton, marginTop: "22px", opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting
                    ? "Processing..."
                    : pendingOrder
                    ? "Retry Payment"
                    : "Pay Securely & Place Order"}
                </button>
              </div>

              {!pendingOrder && <OrderSummary items={items} total={total} />}
=======
                <button type="button" onClick={placeOrder} style={{ ...goldButton, marginTop: "22px" }}>
                  Pay Securely &amp; Place Order
                </button>
              </div>

              <OrderSummary items={items} total={total} />
>>>>>>> origin/warehouse-module
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
