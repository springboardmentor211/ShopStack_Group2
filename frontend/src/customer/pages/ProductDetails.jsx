import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatPrice } from "../../shared/format";
import { addToCart, MAX_QUANTITY } from "../../store/cartSlice";
import WishlistButton from "../components/WishlistButton";
import { isLoggedIn } from "../services/authService";
import AddToCartButton from "../components/AddToCartButton";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const products = useSelector((state) => state.products.items);
  const productsStatus = useSelector((state) => state.products.status);
  const product = products.find((item) => String(item.id) === id);

  if (!product && (productsStatus === "idle" || productsStatus === "loading")) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fffaf2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#716c64",
          fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        }}
      >
        Loading product...
      </div>
    );
  }
=======
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const products = [
  {
    id: "premium-smartphone",
    name: "Premium Smartphone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    rating: "4.5",
    reviews: "230",
    price: "₹49,999",
    oldPrice: "₹59,999",
    discount: "17% OFF",
    description:
      "A premium smartphone designed for everyday performance, entertainment, photography, and smooth multitasking.",
  },
  {
    id: "slim-performance-laptop",
    name: "Slim Performance Laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
    rating: "4.7",
    reviews: "189",
    price: "₹64,999",
    oldPrice: "₹74,999",
    discount: "13% OFF",
    description:
      "A slim and powerful laptop built for productivity, study, entertainment, and everyday computing.",
  },
  {
    id: "wireless-headphones",
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    rating: "4.8",
    reviews: "316",
    price: "₹2,499",
    oldPrice: "₹3,499",
    discount: "29% OFF",
    description:
      "Enjoy immersive sound and comfortable wireless listening with these everyday headphones.",
  },
  {
    id: "smart-fitness-watch",
    name: "Smart Fitness Watch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    rating: "4.6",
    reviews: "173",
    price: "₹3,999",
    oldPrice: "₹5,999",
    discount: "33% OFF",
    description:
      "A smart fitness watch for tracking daily activity while keeping you connected throughout the day.",
  },
  {
    id: "everyday-travel-backpack",
    name: "Everyday Travel Backpack",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    rating: "4.7",
    reviews: "102",
    price: "₹1,499",
    oldPrice: "₹2,199",
    discount: "32% OFF",
    description:
      "A practical everyday backpack with enough space for work, college, travel, and daily essentials.",
  },
  {
    id: "classic-everyday-style",
    name: "Classic Everyday Style",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    rating: "4.5",
    reviews: "158",
    price: "₹1,999",
    oldPrice: "₹2,999",
    discount: "33% OFF",
    description:
      "A classic fashion choice designed to fit effortlessly into your everyday wardrobe.",
  },
];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === id);
>>>>>>> origin/warehouse-module

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
<<<<<<< HEAD
            {product.discount && (
<div
=======
            <div
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
            {product.rating && (
<div
=======
            <div
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module

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
<<<<<<< HEAD
                {formatPrice(product.price)}
              </span>

              {product.oldPrice && (
<span
=======
                {product.price}
              </span>

              <span
>>>>>>> origin/warehouse-module
                style={{
                  fontSize: "14px",
                  color: "#9b9287",
                  textDecoration: "line-through",
                }}
              >
<<<<<<< HEAD
                {formatPrice(product.oldPrice)}
              </span>
)}

              {product.discount && (
<span
=======
                {product.oldPrice}
              </span>

              <span
>>>>>>> origin/warehouse-module
                style={{
                  fontSize: "14px",
                  color: "#b58243",
                  fontWeight: "600",
                }}
              >
                {product.discount}
              </span>
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
=======
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
                  {quantity}
=======
                  1
>>>>>>> origin/warehouse-module
                </span>

                <button
                  type="button"
<<<<<<< HEAD
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
=======
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
              <AddToCartButton productId={product.id} quantity={quantity} height={46} />

              <button
                type="button"
                onClick={async () => {
                  if (!isLoggedIn()) {
                    navigate("/login", { state: { from: `/products/${product.id}` } });
                    return;
                  }
                  const result = await dispatch(
                    addToCart({ id: product.id, quantity })
                  );
                  if (addToCart.rejected.match(result)) return;
                  navigate("/cart");
                }}
=======
              <button
                type="button"
                style={{
                  flex: 1,
                  height: "46px",
                  border: "1px solid #211f1b",
                  borderRadius: "7px",
                  backgroundColor: "#ffffff",
                  color: "#211f1b",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>

              <button
                type="button"
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD

              <WishlistButton productId={product.id} variant="square" />
=======
>>>>>>> origin/warehouse-module
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