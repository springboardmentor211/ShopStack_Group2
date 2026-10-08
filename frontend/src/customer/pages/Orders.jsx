import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatPrice } from "../../shared/data/products";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("shop360_orders") || "[]"
    );

    setOrders(savedOrders);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fffaf2",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: "45px 40px 70px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "30px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "3px",
                color: "#b58243",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Your purchases
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "42px",
                fontWeight: "700",
                color: "#211f1b",
              }}
            >
              My Orders
            </h1>
          </div>

          {orders.length === 0 ? (
            /* ================================
               NO ORDERS
            ================================= */
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "12px",
                padding: "60px 30px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  margin: "0 0 10px",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "28px",
                  color: "#211f1b",
                }}
              >
                No orders yet
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#716c64",
                }}
              >
                Your orders will appear here after you place an order.
              </p>
            </div>
          ) : (
            /* ================================
               ORDERS
            ================================= */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5d9c9",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* ORDER HEADER */}
                  <div
                    style={{
                      padding: "18px 22px",
                      backgroundColor: "#f8f0e3",
                      borderBottom: "1px solid #e5d9c9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#716c64",
                          marginBottom: "5px",
                        }}
                      >
                        Order ID
                      </div>

                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#211f1b",
                        }}
                      >
                        {order.id}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#716c64",
                          marginBottom: "5px",
                        }}
                      >
                        Order Date
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#211f1b",
                        }}
                      >
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#716c64",
                          marginBottom: "5px",
                        }}
                      >
                        Payment
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#211f1b",
                        }}
                      >
                        {order.paymentMethod}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "7px 13px",
                        borderRadius: "20px",
                        backgroundColor: "#e8f4e8",
                        color: "#2e6b35",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {order.status}
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div style={{ padding: "22px" }}>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          paddingBottom: "18px",
                          marginBottom: "18px",
                          borderBottom: "1px solid #eee5d9",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "85px",
                            height: "85px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            backgroundColor: "#f6f1e9",
                            flexShrink: 0,
                          }}
                        />

                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#211f1b",
                              marginBottom: "7px",
                            }}
                          >
                            {item.name}
                          </div>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "#716c64",
                            }}
                          >
                            Quantity: {item.quantity}
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              color: "#716c64",
                              marginTop: "4px",
                            }}
                          >
                            Price: {formatPrice(item.price)}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#211f1b",
                          }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}

                    {/* TOTAL */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "5px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "#211f1b",
                        }}
                      >
                        Total Amount
                      </span>

                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#b58243",
                        }}
                      >
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;