import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
<<<<<<< HEAD
import { formatPrice } from "../../shared/format";
import { resolveProduct } from "../../shared/productUtils";
=======
import { getProductById, formatPrice } from "../../shared/data/products";
>>>>>>> origin/warehouse-module
import {
  setQuantity,
  removeFromCart,
  clearCart,
  MAX_QUANTITY,
} from "../../store/cartSlice";
<<<<<<< HEAD
import { addToWishlist } from "../../store/wishlistSlice";
=======
import { toggleWishlist } from "../../store/wishlistSlice";
>>>>>>> origin/warehouse-module

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistIds = useSelector((state) => state.wishlist.ids);
<<<<<<< HEAD
  const products = useSelector((state) => state.products.items);
  const cartStatus = useSelector((state) => state.cart.status);

  // Join cart entries with the full product details.
  const items = cartItems
    .map((entry) => ({ ...entry, product: resolveProduct(entry, products) }));

  const totalItems = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, entry) =>
      sum + (entry.product.oldPrice ?? entry.product.price) * entry.quantity,
=======

  // Join cart entries with the full product details.
  const items = cartItems
    .map((entry) => ({ ...entry, product: getProductById(entry.id) }))
    .filter((entry) => entry.product);

  const totalItems = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, entry) => sum + entry.product.oldPrice * entry.quantity,
>>>>>>> origin/warehouse-module
    0
  );
  const total = items.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  const savings = mrpTotal - total;

<<<<<<< HEAD
  const moveToWishlist = async (id) => {
    if (!wishlistIds.includes(id)) {
      const result = await dispatch(addToWishlist(id));
      if (addToWishlist.rejected.match(result)) return;
    }
=======
  const moveToWishlist = (id) => {
    if (!wishlistIds.includes(id)) dispatch(toggleWishlist(id));
>>>>>>> origin/warehouse-module
    dispatch(removeFromCart(id));
  };

  const stepButton = {
    width: "34px",
    height: "34px",
    border: "none",
    backgroundColor: "#f6f1e9",
    fontSize: "16px",
    cursor: "pointer",
  };

  const linkButton = {
    border: "none",
    background: "transparent",
    padding: 0,
    fontSize: "13px",
    fontWeight: "600",
    color: "#9b672d",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fffaf2",
        color: "#24211d",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <Navbar />

      <main style={{ padding: "35px 40px 60px", boxSizing: "border-box" }}>
        {/* HEADER */}
        <div style={{ maxWidth: "1400px", margin: "0 auto 28px" }}>
          <button
            type="button"
            onClick={() => navigate("/products")}
            style={{ ...linkButton, marginBottom: "16px" }}
          >
            ← Continue Shopping
          </button>

          <div
            style={{
              fontSize: "13px",
              color: "#bd8740",
              letterSpacing: "2px",
              fontWeight: "600",
              marginBottom: "6px",
            }}
          >
            REVIEW YOUR ITEMS
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "38px",
              fontWeight: "700",
              color: "#211f1b",
            }}
          >
            Shopping Cart
          </h1>

          <p style={{ margin: "8px 0 0", color: "#716c64", fontSize: "14px" }}>
            {items.length === 0
              ? "Items you add will show up here."
              : `You have ${totalItems} ${
                  totalItems === 1 ? "item" : "items"
                } in your cart.`}
          </p>
        </div>

        {items.length === 0 ? (
          /* EMPTY STATE */
          <div
            style={{
              maxWidth: "1400px",
              margin: "40px auto",
              backgroundColor: "#ffffff",
              border: "1px solid #d9c6ad",
              borderRadius: "14px",
              padding: "50px 40px",
              textAlign: "center",
              color: "#716c64",
            }}
          >
            <h2
              style={{
                margin: "0 0 8px",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "24px",
                color: "#211f1b",
              }}
            >
<<<<<<< HEAD
              {cartStatus === "idle" || cartStatus === "loading"
                ? "Loading your cart..."
                : "Your cart is empty"}
=======
              Your cart is empty
>>>>>>> origin/warehouse-module
            </h2>
            <p style={{ margin: "0 0 22px", fontSize: "14px" }}>
              Browse our products and add something you like.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              style={{
                height: "42px",
                padding: "0 28px",
                border: "none",
                borderRadius: "7px",
                backgroundColor: "#211f1b",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Shop Products
            </button>
          </div>
        ) : (
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 360px",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* ITEMS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {items.map(({ id, quantity, product }) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9c6ad",
                    borderRadius: "14px",
                    padding: "16px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => navigate(`/products/${id}`)}
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      backgroundColor: "#f6f1e9",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <h3
                        onClick={() => navigate(`/products/${id}`)}
                        style={{
                          margin: 0,
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "#211f1b",
                          lineHeight: "1.3",
                          cursor: "pointer",
                        }}
                      >
                        {product.name}
                      </h3>

                      <span
                        style={{
                          fontSize: "19px",
                          fontWeight: "700",
                          color: "#211f1b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#211f1b" }}>
                        {formatPrice(product.price)} each
                      </span>
<<<<<<< HEAD
                      {product.oldPrice && (
<span
=======
                      <span
>>>>>>> origin/warehouse-module
                        style={{
                          fontSize: "13px",
                          color: "#9b9287",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatPrice(product.oldPrice)}
                      </span>
<<<<<<< HEAD
)}
                      {product.discount && (
<span
=======
                      <span
>>>>>>> origin/warehouse-module
                        style={{
                          fontSize: "13px",
                          color: "#b58243",
                          fontWeight: "500",
                        }}
                      >
                        {product.discount}
                      </span>
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "22px",
                        marginTop: "18px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #d9c6ad",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() =>
                            dispatch(setQuantity({ id, quantity: quantity - 1 }))
                          }
                          style={{
                            ...stepButton,
                            opacity: quantity <= 1 ? 0.4 : 1,
                            cursor: quantity <= 1 ? "not-allowed" : "pointer",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            width: "36px",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={quantity >= MAX_QUANTITY}
                          onClick={() =>
                            dispatch(setQuantity({ id, quantity: quantity + 1 }))
                          }
                          style={{
                            ...stepButton,
                            opacity: quantity >= MAX_QUANTITY ? 0.4 : 1,
                            cursor:
                              quantity >= MAX_QUANTITY ? "not-allowed" : "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => moveToWishlist(id)}
                        style={linkButton}
                      >
                        Move to Wishlist
                      </button>

                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(id))}
                        style={{ ...linkButton, color: "#716c64" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  style={{ ...linkButton, color: "#716c64" }}
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d9c6ad",
                borderRadius: "14px",
                padding: "22px",
                boxSizing: "border-box",
                position: "sticky",
                top: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 18px",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: "22px",
                  color: "#211f1b",
                }}
              >
                Order Summary
              </h2>

              {[
                [`Price (${totalItems} ${totalItems === 1 ? "item" : "items"})`, formatPrice(mrpTotal), "#211f1b"],
<<<<<<< HEAD
                ...(savings > 0
                  ? [["Discount", `− ${formatPrice(savings)}`, "#b58243"]]
                  : []),
=======
                ["Discount", `− ${formatPrice(savings)}`, "#b58243"],
>>>>>>> origin/warehouse-module
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "14px",
                    color: "#716c64",
                  }}
                >
                  <span>{label}</span>
                  <span style={{ color, fontWeight: "600" }}>{value}</span>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #e5d9c9",
                  marginTop: "16px",
                  paddingTop: "16px",
                }}
              >
                <span
                  style={{ fontSize: "15px", fontWeight: "700", color: "#211f1b" }}
                >
                  Total Amount
                </span>
                <span
                  style={{ fontSize: "22px", fontWeight: "700", color: "#211f1b" }}
                >
                  {formatPrice(total)}
                </span>
              </div>

              {savings > 0 && (
                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: "13px",
                    color: "#b58243",
                    fontWeight: "500",
                  }}
                >
                  You will save {formatPrice(savings)} on this order.
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  height: "46px",
                  marginTop: "20px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor: "#211f1b",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
