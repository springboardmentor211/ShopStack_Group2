import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import products, { formatPrice } from "../../shared/data/products";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";

const Deals = () => {
  const navigate = useNavigate();

  // Deals shows the first six products from the shared list.
  const deals = products.slice(0, 6);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fffaf2",
        color: "#24211d",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
      }}
    >
      <Navbar />

      <main
        style={{
          width: "100%",
          padding: "35px 40px 70px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto 30px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              border: "none",
              background: "transparent",
              color: "#9b672d",
              fontSize: "13px",
              fontWeight: "600",
              padding: 0,
              marginBottom: "18px",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>

          <div
            style={{
              fontSize: "14px",
              color: "#bd8740",
              letterSpacing: "2px",
              fontWeight: "700",
              marginBottom: "7px",
            }}
          >
            TODAY'S OFFERS
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "40px",
              fontWeight: "700",
              color: "#211f1b",
            }}
          >
            Today's Deals
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#716c64",
              fontSize: "15px",
            }}
          >
            Discover today's best offers and save more on your favorite
            products.
          </p>
        </div>

        {/* DEALS GRID */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "18px",
          }}
        >
          {deals.map((product) => (
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
              {/* IMAGE */}
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

          <WishlistButton productId={product.id} />

                {/* DISCOUNT */}
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
              </div>

              {/* DETAILS */}
              <div
                style={{
                  padding: "15px 16px 16px",
                }}
              >
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

                {/* RATING */}
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

                  <span
                    style={{
                      fontSize: "14px",
                      color: "#716c64",
                    }}
                  >
                    ({product.reviews})
                  </span>
                </div>

                {/* PRICE */}
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

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#9b9287",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.oldPrice)}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#b58243",
                      fontWeight: "500",
                    }}
                  >
                    {product.discount}
                  </span>
                </div>

                {/* VIEW PRODUCT */}
                <div style={{ display: "flex", gap: "10px" }}>
<button
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
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
                  View Product
                </button>
<AddToCartButton productId={product.id} />
</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;