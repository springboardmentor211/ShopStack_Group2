import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummary, { getCartDetails } from "../components/OrderSummary";
import {
  page, card, title, sectionTitle, label, input, errorText,
  darkButton, backButton,
} from "../../shared/ui";

const formatDay = (daysFromNow) =>
  new Date(Date.now() + daysFromNow * 86400000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
<<<<<<< HEAD
  const products = useSelector((state) => state.products.items);
  const { items, total } = getCartDetails(cartItems, products);
=======
  const { items, total } = getCartDetails(cartItems);
>>>>>>> origin/warehouse-module

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [payment, setPayment] = useState("upi");
  const [errors, setErrors] = useState({});

  const handleContinue = () => {
    const next = {};
    if (address.trim().length < 8) next.address = "Enter your full delivery address.";
    if (!city.trim()) next.city = "Enter your city.";
    if (!/^\d{6}$/.test(pin.trim())) next.pin = "Enter a 6-digit PIN code.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    navigate("/payment", {
      state: { address: address.trim(), city: city.trim(), pin: pin.trim(), payment },
    });
  };

  const radioRow = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
    fontSize: "14px",
    color: "#211f1b",
    cursor: "pointer",
  };

  return (
    <div style={page}>
      <Navbar />

      <main style={{ padding: "35px 40px 70px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <button type="button" onClick={() => navigate("/cart")} style={backButton}>
            ← Back to Cart
          </button>

          <h1 style={{ ...title, marginBottom: "24px" }}>Checkout</h1>

          {items.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: "50px 40px" }}>
              <h2 style={sectionTitle}>Your cart is empty</h2>
              <p style={{ margin: "0 0 22px", fontSize: "14px", color: "#716c64" }}>
                Add something to your cart before checking out.
              </p>
              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{ ...darkButton, width: "auto", padding: "0 28px" }}
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 380px",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* DELIVERY ADDRESS */}
                <div style={card}>
                  <h2 style={sectionTitle}>Delivery Address</h2>

                  <label htmlFor="address" style={label}>Address</label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ ...input, height: "auto", padding: "12px 14px", resize: "vertical" }}
                  />
                  {errors.address && <p style={errorText}>{errors.address}</p>}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "18px" }}>
                    <div>
                      <label htmlFor="city" style={label}>City</label>
                      <input id="city" style={input} value={city} onChange={(e) => setCity(e.target.value)} />
                      {errors.city && <p style={errorText}>{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="pin" style={label}>PIN code</label>
                      <input
                        id="pin"
                        inputMode="numeric"
                        maxLength={6}
                        style={input}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                      />
                      {errors.pin && <p style={errorText}>{errors.pin}</p>}
                    </div>
                  </div>
                </div>

                {/* DELIVERY METHOD */}
                <div style={card}>
                  <h2 style={sectionTitle}>Delivery Method</h2>
                  <label style={{ ...radioRow, marginBottom: 0 }}>
                    <input type="radio" checked readOnly style={{ accentColor: "#b58243" }} />
                    <span>
                      <span style={{ display: "block", fontWeight: "700" }}>Standard Delivery</span>
                      <span style={{ fontSize: "13px", color: "#716c64" }}>
                        Free · Estimated {formatDay(3)} – {formatDay(5)}
                      </span>
                    </span>
                  </label>
                </div>

                {/* PAYMENT SELECTION */}
                <div style={card}>
                  <h2 style={sectionTitle}>Payment Selection</h2>
                  {[
                    ["upi", "UPI / Wallet"],
                    ["cod", "Cash on Delivery"],
                  ].map(([value, text]) => (
                    <label key={value} style={radioRow}>
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === value}
                        onChange={() => setPayment(value)}
                        style={{ accentColor: "#b58243" }}
                      />
                      {text}
                    </label>
                  ))}
                </div>

                <button type="button" onClick={handleContinue} style={darkButton}>
                  Continue to Payment
                </button>
              </div>

              <div style={{ position: "sticky", top: "20px" }}>
                <OrderSummary items={items} total={total} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
