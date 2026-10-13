import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
<<<<<<< HEAD
import { useSelector } from "react-redux";
import { formatPrice } from "../../shared/format";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";
const Products = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const productsStatus = useSelector((state) => state.products.status);
  const productsError = useSelector((state) => state.products.error);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

=======
const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const products = [
    {
      id: "premium-smartphone",
      category: "Mobiles",
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
      category: "Laptops",
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
      category: "Headphones",
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
      category: "Smartwatches",
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
      category: "Sports",
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
      category: "Fashion",
      name: "Classic Everyday Style",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      rating: "4.5",
      reviews: "158",
      price: "₹1,999",
      oldPrice: "₹2,999",
      discount: "33% OFF",
    },
    {
      id: "modern-4k-smart-tv",
      category: "TV",
      name: "Modern 4K Smart TV",
      image:
        "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      rating: "4.6",
      reviews: "145",
      price: "₹39,999",
      oldPrice: "₹49,999",
      discount: "20% OFF",
    },
    {
      id: "premium-running-shoes",
      category: "Sports",
      name: "Premium Running Shoes",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      rating: "4.7",
      reviews: "198",
      price: "₹2,799",
      oldPrice: "₹3,999",
      discount: "30% OFF",
    },
    {
      id: "portable-bluetooth-speaker",
      category: "Electronics",
      name: "Portable Bluetooth Speaker",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
      rating: "4.8",
      reviews: "267",
      price: "₹1,999",
      oldPrice: "₹2,999",
      discount: "33% OFF",
    },
    {
      id: "minimal-desk-lamp",
      category: "Home & Kitchen",
      name: "Minimal Desk Lamp",
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      rating: "4.5",
      reviews: "87",
      price: "₹899",
      oldPrice: "₹1,299",
      discount: "31% OFF",
    },
    {
      id: "skincare-essentials-set",
      category: "Beauty",
      name: "Skincare Essentials Set",
      image:
        "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
      rating: "4.6",
      reviews: "124",
      price: "₹1,299",
      oldPrice: "₹1,799",
      discount: "28% OFF",
    },
    {
      id: "classic-analog-watch",
      category: "Fashion",
      name: "Classic Analog Watch",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
      rating: "4.7",
      reviews: "211",
      price: "₹2,499",
      oldPrice: "₹3,499",
      discount: "29% OFF",
    },
    {
      id: "classic-book-collection",
      category: "Books",
      name: "Classic Book Collection",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
      rating: "4.7",
      reviews: "96",
      price: "₹699",
      oldPrice: "₹999",
      discount: "30% OFF",
    },
  ];
>>>>>>> origin/warehouse-module

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
<<<<<<< HEAD
          {productsStatus === "idle" || productsStatus === "loading"
            ? "Loading products..."
            : productsStatus === "failed"
            ? productsError
            : selectedCategory
            ? "No products found in this category."
            : "No products available yet."}
=======
          No products found in this category.
>>>>>>> origin/warehouse-module
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

<<<<<<< HEAD
          <WishlistButton productId={product.id} />

                {product.discount && (
<div
=======
                <div
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
)}
=======
>>>>>>> origin/warehouse-module

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
                      fontSize: "13px",
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
                      fontSize: "13px",
                      color: "#b58243",
                      fontWeight: "500",
                    }}
                  >
                    {product.discount}
                  </span>
<<<<<<< HEAD
)}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
<button
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    flex: 1,
=======
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    width: "100%",
>>>>>>> origin/warehouse-module
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
<<<<<<< HEAD
<AddToCartButton productId={product.id} />
</div>
=======
>>>>>>> origin/warehouse-module
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
