import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import products, { formatPrice } from "../../shared/data/products";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";
const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");


  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const heading = selectedCategory
    ? `${selectedCategory} Products`
    : "All Products";

  const description = selectedCategory
    ? `Showing products from ${selectedCategory}.`
    : "Discover everything available at Shop360.";

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
          padding: "35px 40px 60px",
          boxSizing: "border-box",
        }}
      >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 28px",
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
            marginBottom: "16px",
            cursor: "pointer",
          }}
        >
          ← Back to Home
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
          SHOP OUR COLLECTION
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
          {heading}
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#716c64",
            fontSize: "14px",
          }}
        >
          {description}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div
          style={{
            maxWidth: "1400px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            border: "1px solid #d9c6ad",
            borderRadius: "14px",
            padding: "40px",
            textAlign: "center",
            color: "#716c64",
          }}
        >
          No products found in this category.
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
          {filteredProducts.map((product) => (
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

          <WishlistButton productId={product.id} />

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
      )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
