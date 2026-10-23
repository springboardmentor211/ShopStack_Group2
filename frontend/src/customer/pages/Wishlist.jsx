import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WishlistButton from "../components/WishlistButton";
import { formatPrice } from "../../shared/format";
import { addToCart } from "../../store/cartSlice";
import { removeFromWishlist } from "../../store/wishlistSlice";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  const products = useSelector((state) => state.products.items);
  const wishlistStatus = useSelector((state) => state.wishlist.status);

  const wishlistProducts = wishlistIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const moveToCart = async (id) => {
    const result = await dispatch(addToCart({ id, quantity: 1 }));
    if (addToCart.rejected.match(result)) return;
    dispatch(removeFromWishlist(id));
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
            style={{
              border: "none",
              background: "transparent",
              color: "#9b672d",
              fontSize: "13px",
              fontWeight: "600",
              padding: 0,
              marginBottom: "16px",
              cursor: "pointer",
            }}
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
            SAVED FOR LATER
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
            My Wishlist
          </h1>

          <p style={{ margin: "8px 0 0", color: "#716c64", fontSize: "14px" }}>
            {wishlistProducts.length === 0
              ? "Products you save will show up here."
              : `${wishlistProducts.length} ${
                  wishlistProducts.length === 1 ? "product" : "products"
                } saved.`}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
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
              {wishlistStatus === "idle" ? "Loading your wishlist..." : "Your wishlist is empty"}
            </h2>
            <p style={{ margin: "0 0 22px", fontSize: "14px" }}>
              Tap the heart on any product to save it here.
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
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {wishlistProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9c6ad",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "220px",
                      backgroundColor: "#f6f1e9",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        cursor: "pointer",
                      }}
                    />

                    {product.discount && (
<div
                      style={{
                        position: "absolute",
                        top: "11px",
                        left: "11px",
                        backgroundColor: "#b58243",
                        color: "#ffffff",
                        padding: "7px 10px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "700",
                        lineHeight: "1",
                      }}
                    >
                      {product.discount}
                    </div>
)}

                    <WishlistButton productId={product.id} />
                  </div>

                  <div style={{ padding: "15px 16px 16px" }}>
                    <h3
                      style={{
                        margin: "0 0 25px",
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#211f1b",
                        lineHeight: "1.3",
                      }}
                    >
                      {product.name}
                    </h3>

                    {product.rating && (
<div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "14px",
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
                          lineHeight: "1",
                        }}
                      >
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span style={{ fontSize: "14px", color: "#716c64" }}>
                        ({product.reviews})
                      </span>
                    </div>
)}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom: "18px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "19px",
                          fontWeight: "700",
                          color: "#211f1b",
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
<span
                        style={{
                          fontSize: "13px",
                          color: "#9b9287",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatPrice(product.oldPrice)}
                      </span>
)}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product.id}`)}
                        style={{
                          flex: 1,
                          height: "42px",
                          border: "1px solid #211f1b",
                          borderRadius: "7px",
                          backgroundColor: "#ffffff",
                          color: "#211f1b",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        View Product
                      </button>

                      <button
                        type="button"
                        onClick={() => moveToCart(product.id)}
                        style={{
                          flex: 1,
                          height: "42px",
                          border: "none",
                          borderRadius: "7px",
                          backgroundColor: "#211f1b",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
