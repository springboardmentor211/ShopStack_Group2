import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const navigate = useNavigate();

  const deals = [
    {
      id: "premium-smartphone",
      name: "Premium Smartphone",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      rating: "4.5",
      reviews: "230",
      price: "₹49,999",
      oldPrice: "₹59,999",
      discount: "17% OFF",
    },
    {
      id: "slim-performance-laptop",
      name: "Slim Performance Laptop",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      rating: "4.7",
      reviews: "189",
      price: "₹64,999",
      oldPrice: "₹74,999",
      discount: "13% OFF",
    },
    {
      id: "wireless-headphones",
      name: "Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      rating: "4.8",
      reviews: "316",
      price: "₹2,499",
      oldPrice: "₹3,499",
      discount: "29% OFF",
    },
    {
      id: "smart-fitness-watch",
      name: "Smart Fitness Watch",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      rating: "4.6",
      reviews: "173",
      price: "₹3,999",
      oldPrice: "₹5,999",
      discount: "33% OFF",
    },
    {
      id: "everyday-travel-backpack",
      name: "Everyday Travel Backpack",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      rating: "4.7",
      reviews: "102",
      price: "₹1,499",
      oldPrice: "₹2,199",
      discount: "32% OFF",
    },
    {
      id: "classic-everyday-style",
      name: "Classic Everyday Style",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      rating: "4.5",
      reviews: "158",
      price: "₹1,999",
      oldPrice: "₹2,999",
      discount: "33% OFF",
    },
  ];

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
                    {product.price}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#9b9287",
                      textDecoration: "line-through",
                    }}
                  >
                    {product.oldPrice}
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
                <button
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    width: "100%",
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