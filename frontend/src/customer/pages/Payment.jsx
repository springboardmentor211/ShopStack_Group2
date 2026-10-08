import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummary, { getCartDetails } from "../components/OrderSummary";
import { clearCart } from "../../store/cartSlice";
import { formatPrice } from "../../shared/data/products";
import {
  page, card, title, sectionTitle, goldButton, darkButton, backButton,
} from "../../shared/ui";

const METHODS = [
  { value: "upi", name: "UPI / Wallet", text: "Pay securely with your preferred UPI app." },
  { value: "card", name: "Credit or Debit Card", text: "Demo card payment option." },
  { value: "cod", name: "Cash on Delivery", text: "Pay when your order arrives." },
];

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const { items, total } = getCartDetails(cartItems);

  const [method, setMethod] = useState(location.state?.payment || "upi");
  const [placedOrder, setPlacedOrder] = useState(null);

  // Opened without going through Checkout (e.g. after a refresh).
  if (!location.state && !placedOrder) return <Navigate to="/checkout" replace />;

  const placeOrder = () => {
    // Demo only: no real payment or order is created until the backend exists.
    setPlacedOrder({ id: `SS${Date.now().toString().slice(-8)}`, total });
    dispatch(clearCart());
  };

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
                Order {placedOrder.id} · {formatPrice(placedOrder.total)}
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{ ...darkButton, width: "auto", padding: "0 28px" }}
              >
                Continue Shopping
              </button>
            </div>
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

                <button type="button" onClick={placeOrder} style={{ ...goldButton, marginTop: "22px" }}>
                  Pay Securely &amp; Place Order
                </button>
              </div>

              <OrderSummary items={items} total={total} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
