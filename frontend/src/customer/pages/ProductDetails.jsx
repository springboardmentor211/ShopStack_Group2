import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductById, formatPrice } from "../../shared/data/products";
import { addToCart, MAX_QUANTITY } from "../../store/cartSlice";
import WishlistButton from "../components/WishlistButton";
import { isLoggedIn } from "../services/authService";
import AddToCartButton from "../components/AddToCartButton";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const product = getProductById(id);

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fffaf2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        }}
      >
        <h2 style={{ color: "#211f1b" }}>Product not found</h2>

        <button
          type="button"
          onClick={() => navigate("/products")}
          style={{
            marginTop: "12px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "7px",
            backgroundColor: "#211f1b",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

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

      <main
        style={{
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
          }}
        >
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate("/products")}
          style={{
            border: "none",
            background: "transparent",
            color: "#9b672d",
            fontSize: "13px",
            fontWeight: "600",
            padding: 0,
            cursor: "pointer",
            marginBottom: "22px",
          }}
        >
          ← Back to Products
        </button>

        {/* PRODUCT AREA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5d9c9",
            borderRadius: "14px",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          {/* IMAGE */}
          <div
            style={{
              position: "relative",
              height: "450px",
              backgroundColor: "#f6f1e9",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* DISCOUNT */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                backgroundColor: "#b58243",
                color: "#ffffff",
                padding: "8px 12px",
                borderRadius: "5px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {product.discount}
            </div>
          </div>

          {/* DETAILS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* LABEL */}
            <div
              style={{
                fontSize: "12px",
                color: "#b58243",
                letterSpacing: "2px",
                fontWeight: "600",
                marginBottom: "9px",
              }}
            >
              SHOP360 PRODUCT
            </div>

            {/* NAME */}
            <h1
              style={{
                margin: "0 0 16px",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "34px",
                lineHeight: "1.15",
                color: "#211f1b",
              }}
            >
              {product.name}
            </h1>

            {/* RATING */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: "#b58243",
                  color: "#ffffff",
                  padding: "7px 10px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                ★ {product.rating}
              </div>

              <span
                style={{
                  color: "#716c64",
                  fontSize: "14px",
                }}
              >
                {product.reviews} reviews
              </span>
            </div>

            {/* PRICE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#211f1b",
                }}
              >
                {formatPrice(product.price)}
              </span>

              <span
                style={{
                  fontSize: "14px",
                  color: "#9b9287",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.oldPrice)}
              </span>

              <span
                style={{
                  fontSize: "14px",
                  color: "#b58243",
                  fontWeight: "600",
                }}
              >
                {product.discount}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p
              style={{
                margin: "0 0 22px",
                color: "#716c64",
                fontSize: "14px",
                lineHeight: "1.6",
                maxWidth: "500px",
              }}
            >
              {product.description}
            </p>

            {/* QUANTITY */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#211f1b",
                }}
              >
                Quantity
              </span>

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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "none",
                    backgroundColor: "#f6f1e9",
                    fontSize: "16px",
                    cursor: "pointer",
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
                  onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                  style={{
                    width: "34px",
                    height: "34px",
                    border: "none",
                    backgroundColor: "#f6f1e9",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <AddToCartButton productId={product.id} quantity={quantity} height={46} />

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn()) {
                    navigate("/login", { state: { from: `/products/${product.id}` } });
                    return;
                  }
                  dispatch(addToCart({ id: product.id, quantity }));
                  navigate("/cart");
                }}
                style={{
                  flex: 1,
                  height: "46px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor: "#211f1b",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>

              <WishlistButton productId={product.id} variant="square" />
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;