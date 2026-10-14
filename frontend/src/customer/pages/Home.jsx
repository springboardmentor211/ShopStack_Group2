import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatPrice } from "../../shared/format";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";
const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: "#fffaf2",
        color: "#24211d",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <Navbar />

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <main
        style={{
          width: "100%",
          padding: "38px 40px 0",
          boxSizing: "border-box",
        }}
      >
        <section
          style={{
            width: "100%",
            minHeight: "430px",
            backgroundColor: "#f5e8d5",
            border: "1px solid #eadac5",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "54px 74px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* =================================================
              HERO LEFT
              ================================================= */}

          <div
            style={{
              width: "58%",
              maxWidth: "720px",
            }}
          >
            {/* EYEBROW */}

            <div
              style={{
                color: "#bd8740",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "3px",
                marginBottom: "22px",
              }}
            >
              THE CONSIDERED MARKETPLACE
            </div>

            {/* MAIN HEADING */}

            <h1
              style={{
                margin: 0,
                padding: 0,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "58px",
                lineHeight: "1.05",
                fontWeight: "500",
                letterSpacing: "-2.5px",
                color: "#24211d",
              }}
            >
              Everything you need,
              <br />
              all in one place.
            </h1>

            {/* DESCRIPTION */}

            <p
              style={{
                margin: "26px 0 0",
                padding: 0,
                maxWidth: "610px",
                color: "#77736e",
                fontSize: "18px",
                lineHeight: "1.8",
                fontWeight: "400",
              }}
            >
              Thoughtfully selected essentials across technology, style, home,
              and more — delivered with care.
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "34px",
              }}
            >
              {/* SHOP NOW */}

              <button
                type="button"
                onClick={() => navigate("/products")}
                style={{
                  height: "58px",
                  padding: "0 27px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#24211d",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span>Shop Now</span>

                <span
                  style={{
                    fontSize: "22px",
                    lineHeight: "1",
                  }}
                >
                  →
                </span>
              </button>

              {/* EXPLORE DEALS */}

              <button
              onClick={() => navigate("/deals")}
                type="button"
                style={{
                  height: "58px",
                  padding: "0 27px",
                  border: "1px solid #d9c7b0",
                  borderRadius: "8px",
                  backgroundColor: "#fffaf2",
                  color: "#24211d",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Explore Deals
              </button>
            </div>
          </div>

          {/* =================================================
              HERO RIGHT — IMAGE GRID
              ================================================= */}

          <div
            style={{
              width: "42%",
              maxWidth: "600px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* IMAGE 1 */}

            <div
              style={{
                height: "178px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
                alt="Smartphone"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* IMAGE 2 */}

            <div
              onClick={() => navigate("/products?category=Headphones")}
              style={{
                height: "178px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
                alt="Headphones"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* IMAGE 3 */}

            <div
              style={{
                height: "178px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                alt="Smartwatch"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* IMAGE 4 */}

            <div
              style={{
                height: "178px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                boxSizing: "border-box",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
                alt="Backpack"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        </section>
                {/* =====================================================
            FEATURE BENEFITS
            ===================================================== */}

        <section
          style={{
            width: "100%",
            marginTop: "38px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            boxSizing: "border-box",
          }}
        >
          {/* =================================================
              FREE DELIVERY
              ================================================= */}

          <div
            style={{
              minHeight: "104px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5d9c9",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              padding: "20px 22px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                color: "#b58243",
                marginRight: "18px",
                flexShrink: 0,
              }}
            >
              🚚
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  color: "#24211d",
                }}
              >
                Free Delivery
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "1.4",
                  color: "#716c64",
                }}
              >
                On qualifying orders
              </div>
            </div>
          </div>

          {/* =================================================
              EASY RETURNS
              ================================================= */}

          <div
            style={{
              minHeight: "104px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5d9c9",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              padding: "20px 22px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "29px",
                color: "#b58243",
                marginRight: "18px",
                flexShrink: 0,
              }}
            >
              ↩
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  color: "#24211d",
                }}
              >
                Easy Returns
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "1.4",
                  color: "#716c64",
                }}
              >
                Simple 7-day returns
              </div>
            </div>
          </div>

          {/* =================================================
              SECURE PAYMENTS
              ================================================= */}

          <div
            style={{
              minHeight: "104px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5d9c9",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              padding: "20px 22px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                color: "#b58243",
                marginRight: "18px",
                flexShrink: 0,
              }}
            >
              🛡
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  color: "#24211d",
                }}
              >
                Secure Payments
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "1.4",
                  color: "#716c64",
                }}
              >
                Protected checkout
              </div>
            </div>
          </div>

          {/* =================================================
              BEST QUALITY
              ================================================= */}

          <div
            style={{
              minHeight: "104px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5d9c9",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              padding: "20px 22px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                color: "#b58243",
                marginRight: "18px",
                flexShrink: 0,
              }}
            >
              ✿
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "1.3",
                  color: "#24211d",
                }}
              >
                Best Quality
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "1.4",
                  color: "#716c64",
                }}
              >
                Verified selections
              </div>
            </div>
          </div>
        </section>
                {/* =====================================================
            TOP CATEGORIES
            ===================================================== */}

        <section
          style={{
            width: "100%",
            marginTop: "68px",
            paddingBottom: "10px",
            boxSizing: "border-box",
          }}
        >
          {/* SECTION LABEL */}

          <div
            style={{
              color: "#b58243",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            EXPLORE THE COLLECTION
          </div>

          {/* SECTION TITLE */}

          <h2
            style={{
              margin: 0,
              padding: 0,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "40px",
              lineHeight: "1.2",
              fontWeight: "500",
              letterSpacing: "-1.5px",
              color: "#24211d",
              marginBottom: "28px",
            }}
          >
            Top Categories
          </h2>

          {/* CATEGORY GRID */}

          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "16px",
              boxSizing: "border-box",
            }}
          >
            {/* =================================================
                MOBILE
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Mobiles")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80"
                alt="Mobiles"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Mobiles
              </div>
            </div>

            {/* =================================================
                LAPTOPS
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Laptops")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80"
                alt="Laptops"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Laptops
              </div>
            </div>

            {/* =================================================
                TV
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=TV")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80"
                alt="TV"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                TV
              </div>
            </div>

            {/* =================================================
                FASHION
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Fashion")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500&q=80"
                alt="Fashion"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Fashion
              </div>
            </div>

            {/* =================================================
                HOME & KITCHEN
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Home%20%26%20Kitchen")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=500&q=80"
                alt="Home and Kitchen"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Home & Kitchen
              </div>
            </div>

            {/* =================================================
                BEAUTY
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Beauty")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80"
                alt="Beauty"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Beauty
              </div>
            </div>

            {/* =================================================
                HEADPHONES
                ================================================= */}

            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
                alt="Headphones"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Headphones
              </div>
            </div>

            {/* =================================================
                SPORTS
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Sports")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80"
                alt="Sports"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Sports
              </div>
            </div>

            {/* =================================================
                SMARTWATCHES
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Smartwatches")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
                alt="Smartwatches"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Smartwatches
              </div>
            </div>

            {/* =================================================
                DEALS
                ================================================= */}

            <div
              onClick={() => navigate("/deals")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=500&q=80"
                alt="Deals"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Deals
              </div>
            </div>

            {/* =================================================
                BOOKS
                ================================================= */}

            <div
              onClick={() => navigate("/products?category=Books")}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5d9c9",
                borderRadius: "14px",
                padding: "16px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80"
                alt="Books"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#24211d",
                }}
              >
                Books
              </div>
            </div>
          </div>
        </section>
        {/* BEST SELLING PRODUCTS */}
<section
  style={{
    marginTop: "72px",
    paddingBottom: "60px",
  }}
>
  {/* SECTION HEADER */}
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: "28px",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "14px",
          color: "#bd8740",
          letterSpacing: "2px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        EXPLORE WHAT'S POPULAR
      </div>

      <h2
        style={{
          margin: 0,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "40px",
          fontWeight: "700",
          color: "#211f1b",
        }}
      >
        Best Selling Products
      </h2>
    </div>

    <button
  type="button"
  onClick={() => navigate("/products")}
  style={{
    border: "none",
    background: "transparent",
    color: "#9b672d",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  View All →
</button>
  </div>

  {/* PRODUCTS GRID */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "18px",
    }}
  >
    {products.slice(0, 6).map((product) => (
      <div
        key={product.name}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #d9c6ad",
          borderRadius: "16px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* PRODUCT IMAGE */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "250px",
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

          {/* DISCOUNT BADGE */}
          {product.discount && (
<div
            style={{
              position: "absolute",
              top: "13px",
              left: "13px",
              backgroundColor: "#b58243",
              color: "#ffffff",
              padding: "8px 12px",
              borderRadius: "5px",
              fontSize: "14px",
              fontWeight: "700",
              lineHeight: "1",
            }}
          >
            {product.discount}
          </div>
)}
        </div>

        {/* PRODUCT DETAILS */}
        <div
          style={{
            padding: "15px 16px 16px",
          }}
        >
          {/* PRODUCT NAME */}
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
          {product.rating && (
<div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
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
)}

          {/* PRICE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "22px",
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

            {product.discount && (
<span
              style={{
                fontSize: "13px",
                color: "#b58243",
                fontWeight: "500",
              }}
            >
              {product.discount}
            </span>
)}
          </div>

          {/* VIEW PRODUCT BUTTON */}
          <div style={{ display: "flex", gap: "10px" }}>
<button
            type="button"
            onClick={() => navigate(`/products/${product.id}`)}
            style={{
              flex: 1,
              height: "42px",
              border: "none",
              borderRadius: "8px",
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
</section>
{/* CUSTOMER REVIEWS */}
<section
  style={{
    marginTop: "20px",
    paddingBottom: "80px",
  }}
>
  {/* SECTION HEADER */}
  <div
    style={{
      textAlign: "center",
      marginBottom: "36px",
    }}
  >
    <div
      style={{
        fontSize: "14px",
        color: "#bd8740",
        letterSpacing: "2px",
        fontWeight: "600",
        marginBottom: "8px",
      }}
    >
      WHAT OUR CUSTOMERS SAY
    </div>

    <h2
      style={{
        margin: 0,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: "40px",
        fontWeight: "700",
        color: "#211f1b",
      }}
    >
      Loved by shoppers
    </h2>
  </div>

  {/* REVIEWS */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "20px",
    }}
  >
    {[
      {
        name: "Ananya Reddy",
        location: "Hyderabad",
        rating: "5.0",
        review:
          "Amazing shopping experience. The products arrived quickly and the quality was exactly what I expected.",
      },
      {
        name: "Rahul Kumar",
        location: "Bengaluru",
        rating: "4.8",
        review:
          "The website is simple to use and I found everything I needed in one place. Delivery was also very smooth.",
      },
      {
        name: "Priya Sharma",
        location: "Chennai",
        rating: "4.9",
        review:
          "Great product selection and very good prices. I will definitely shop here again.",
      },
    ].map((review) => (
      <div
        key={review.name}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5d9c9",
          borderRadius: "14px",
          padding: "26px",
          boxSizing: "border-box",
        }}
      >
        {/* STARS */}
        <div
          style={{
            color: "#b58243",
            fontSize: "18px",
            letterSpacing: "2px",
            marginBottom: "18px",
          }}
        >
          ★★★★★
        </div>

        {/* REVIEW TEXT */}
        <p
          style={{
            margin: "0 0 25px",
            color: "#716c64",
            fontSize: "15px",
            lineHeight: "1.8",
          }}
        >
          "{review.review}"
        </p>

        {/* USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "#f1e2cd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9b672d",
              fontSize: "16px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            {review.name.charAt(0)}
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#211f1b",
                marginBottom: "3px",
              }}
            >
              {review.name}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#716c64",
              }}
            >
              {review.location}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;