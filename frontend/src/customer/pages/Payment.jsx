import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSummary, { getCartDetails } from "../components/OrderSummary";

import { clearCart } from "../../store/cartSlice";
import { formatPrice } from "../../shared/data/products";

import {
  page,
  card,
  title,
  sectionTitle,
  goldButton,
  darkButton,
  backButton,
} from "../../shared/ui";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);

  const { items, total } = getCartDetails(cartItems);

  // Store the placed order in local state
  const [placedOrder, setPlacedOrder] = React.useState(null);

  // If user opens Payment directly without Checkout
  if (!location.state && !placedOrder) {
    return <Navigate to="/checkout" replace />;
  }

  const placeOrder = () => {
    const order = {
      id: `SS${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      paymentMethod: "Cash on Delivery",
      status: "Order Placed",

      items: items.map(({ id, quantity, product }) => ({
        id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      })),

      total,
    };

    // Get previous orders
    const existingOrders = JSON.parse(
      localStorage.getItem("shop360_orders") || "[]"
    );

    // Save newest order
    localStorage.setItem(
      "shop360_orders",
      JSON.stringify([order, ...existingOrders])
    );

    // Show success message
    setPlacedOrder(order);

    // Clear shopping cart
    dispatch(clearCart());
  };

  return (
    <div style={page}>
      <Navbar />

      <main
        style={{
          padding: "35px 40px 70px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          {placedOrder ? (
            /* ================================
               ORDER PLACED
            ================================= */
            <div
              style={{
                ...card,
                textAlign: "center",
                padding: "50px 40px",
              }}
            >
              <h1 style={title}>Order placed successfully!</h1>

              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "14px",
                  color: "#716c64",
                }}
              >
                Thank you for shopping with Shop360.
              </p>

              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "14px",
                  color: "#211f1b",
                }}
              >
                Order ID: <strong>{placedOrder.id}</strong>
              </p>

              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  color: "#211f1b",
                }}
              >
                Total: <strong>{formatPrice(placedOrder.total)}</strong>
              </p>

              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  color: "#716c64",
                }}
              >
                Payment Method: Cash on Delivery
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                  style={{
                    ...goldButton,
                    width: "auto",
                    padding: "0 28px",
                  }}
                >
                  View My Orders
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  style={{
                    ...darkButton,
                    width: "auto",
                    padding: "0 28px",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* ================================
               EMPTY CART
            ================================= */
            <div
              style={{
                ...card,
                textAlign: "center",
                padding: "50px 40px",
              }}
            >
              <h2 style={sectionTitle}>Your cart is empty</h2>

              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{
                  ...darkButton,
                  width: "auto",
                  padding: "0 28px",
                }}
              >
                Shop Products
              </button>
            </div>
          ) : (
            /* ================================
               COD PAYMENT
            ================================= */
            <>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                style={backButton}
              >
                ← Back to Checkout
              </button>

              <h1
                style={{
                  ...title,
                  marginBottom: "24px",
                }}
              >
                Cash on Delivery
              </h1>

              <div
                style={{
                  ...card,
                  marginBottom: "24px",
                }}
              >
                <h2 style={sectionTitle}>
                  Payment Method
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px",
                    border: "1px solid #e5d9c9",
                    borderRadius: "8px",
                    backgroundColor: "#fffaf2",
                  }}
                >
                  <input
                    type="radio"
                    checked
                    readOnly
                    style={{
                      accentColor: "#b58243",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#211f1b",
                      }}
                    >
                      Cash on Delivery
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#716c64",
                        marginTop: "4px",
                      }}
                    >
                      Pay when your order arrives at your doorstep.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "22px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5d9c9",
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#211f1b",
                  }}
                >
                  <span>Total Amount</span>

                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  type="button"
                  onClick={placeOrder}
                  style={{
                    ...goldButton,
                    marginTop: "22px",
                  }}
                >
                  Place Order — Cash on Delivery
                </button>
              </div>

              <OrderSummary
                items={items}
                total={total}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;