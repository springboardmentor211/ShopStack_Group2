import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const NAV_CATEGORIES = [
  { label: "All Categories", path: "/products" },
  { label: "Mobiles & Accessories", path: "/products?category=Mobiles" },
  { label: "Electronics", path: "/products?category=Electronics" },
  { label: "Fashion", path: "/products?category=Fashion" },
  { label: "Home & Kitchen", path: "/products?category=Home%20%26%20Kitchen" },
  { label: "Beauty & Personal Care", path: "/products?category=Beauty" },
  { label: "Sports & Outdoors", path: "/products?category=Sports" },
  { label: "Books & More", path: "/products?category=Books" },
  { label: "Deals", path: "/deals" },
];

const SEARCH_PRODUCTS = [
  { id: "premium-smartphone", name: "Premium Smartphone", category: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80" },
  { id: "slim-performance-laptop", name: "Slim Performance Laptop", category: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80" },
  { id: "wireless-headphones", name: "Wireless Headphones", category: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" },
  { id: "smart-fitness-watch", name: "Smart Fitness Watch", category: "Smartwatches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" },
  { id: "everyday-travel-backpack", name: "Everyday Travel Backpack", category: "Sports", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80" },
  { id: "classic-everyday-style", name: "Classic Everyday Style", category: "Fashion", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=200&q=80" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();

  const categorySuggestions = normalizedSearch
    ? NAV_CATEGORIES.filter(
        (category) =>
          category.label !== "All Categories" &&
          category.label.toLowerCase().includes(normalizedSearch)
      ).slice(0, 4)
    : [];

  const productSuggestions = normalizedSearch
    ? SEARCH_PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch)
      ).slice(0, 6)
    : [];

  const hasSearchSuggestions =
    categorySuggestions.length > 0 || productSuggestions.length > 0;

  const [location, setLocation] = useState({
    city: "",
    pincode: "",
  });

  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocation({
        city: "Location unavailable",
        pincode: "",
      });
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Reverse geocoding failed");
          }

          const data = await response.json();
          const address = data.address || {};

          const detectedCity =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "Unknown";

          setLocation({
            city: detectedCity,
            pincode: address.postcode || "",
          });
        } catch (error) {
          console.error("Location lookup failed:", error);

          setLocation({
            city: "Location unavailable",
            pincode: "",
          });
        } finally {
          setLocationLoading(false);
        }
      },
      async (error) => {
        console.error("Geolocation error:", error);

        // Browser location can be blocked/denied. Fall back to
        // approximate IP-based location so the navbar still shows a city.
        try {
          const response = await fetch("https://ipwho.is/");

          if (!response.ok) {
            throw new Error("IP location lookup failed");
          }

          const data = await response.json();

          setLocation({
            city: data.city || "Location unavailable",
            pincode: data.postal || "",
          });
        } catch (fallbackError) {
          console.error("Fallback location error:", fallbackError);

          setLocation({
            city: "Location unavailable",
            pincode: "",
          });
        } finally {
          setLocationLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  const categories = [
    {
      name: "All Categories",
      path: "/products",
    },
    {
      name: "Mobiles & Accessories",
      path: "/products?category=Mobiles",
    },
    {
      name: "Electronics",
      path: "/products?category=Electronics",
    },
    {
      name: "Fashion",
      path: "/products?category=Fashion",
    },
    {
      name: "Home & Kitchen",
      path: "/products?category=Home%20%26%20Kitchen",
    },
    {
      name: "Beauty & Personal Care",
      path: "/products?category=Beauty",
    },
    {
      name: "Sports & Outdoors",
      path: "/products?category=Sports",
    },
    {
      name: "Books & More",
      path: "/products?category=Books",
    },
    {
      name: "Deals",
      path: "/deals",
    },
  ];
  

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#fffaf2",
        color: "#24211d",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
      }}
    >
      {/* =====================================================
          TOP BLACK BAR
          ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "37px",
          backgroundColor: "#211f1b",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            height: "100%",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT */}

          <div
            style={{
              fontSize: "11px",
              fontWeight: "400",
              lineHeight: "1",
              whiteSpace: "nowrap",
            }}
          >
            Deliver to{" "}
            {location.city &&
            location.city !== "Location unavailable"
              ? location.city
              : "your location"}

            <span
              style={{
                margin: "0 7px",
                color: "#b58243",
              }}
            >
              •
            </span>

            Free Delivery on orders over ₹499
          </div>

          {/* RIGHT */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              fontSize: "10px",
              fontWeight: "400",
            }}
          >
            <span>Track Order</span>
            <span>Customer Support</span>
            <span>Download App</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVBAR
          ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "94px",
          backgroundColor: "#fffaf2",
          borderBottom: "1px solid #e5d9c9",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            height: "100%",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* =================================================
              LOGO
              ================================================= */}

          <div
            style={{
              width: "180px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "35px",
                fontWeight: "700",
                lineHeight: "1",
                letterSpacing: "-2px",
                color: "#211f1b",
                whiteSpace: "nowrap",
              }}
            >
              Shop
              <span
                style={{
                  color: "#b58243",
                }}
              >
                360
              </span>
            </div>
          </div>

          {/* =================================================
              LOCATION
              ================================================= */}

          <div
            onClick={detectLocation}
            title="Click to detect your location"
            style={{
              width: "150px",
              flexShrink: 0,
              marginRight: "18px",
              display: "flex",
              alignItems: "center",
              gap: "9px",
              cursor: "pointer",
            }}
          >
            <MapPin
              size={19}
              strokeWidth={1.8}
              color="#211f1b"
            />

            <div
              style={{
                minWidth: 0,
                lineHeight: "15px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#211f1b",
                }}
              >
                Deliver to
              </div>

              <div
                style={{
                  marginTop: "1px",
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "#716c64",
                  whiteSpace: "nowrap",
                }}
              >
                {locationLoading
                  ? "Detecting location..."
                  : location.city || "Location unavailable"}
              </div>

              {!locationLoading && location.pincode && (
                <div
                  style={{
                    marginTop: "2px",
                    fontSize: "10px",
                    color: "#9b672d",
                    fontWeight: "600",
                  }}
                >
                  {location.pincode}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              SEARCH
              ================================================= */}

          <div
            style={{
              flex: 1,
              height: "49px",
              minWidth: 0,
              backgroundColor: "#ffffff",
              border: "1px solid #e5d9c9",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(event) => {
                const value = event.target.value;
                setSearch(value);
                setShowSearchSuggestions(value.trim().length > 0);
              }}
              onFocus={() => {
                if (search.trim()) {
                  setShowSearchSuggestions(true);
                }
              }}
              placeholder="Search for products, brands and more"
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                padding: "0 16px",
                color: "#24211d",
                fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
                fontSize: "17px",
                fontWeight: "400",
                boxSizing: "border-box",
              }}
            />

            {showSearchSuggestions && search.trim() && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  left: 0,
                  right: 0,
                  width: "100%",
                  backgroundColor: "#fffaf2",
                  border: "1px solid #e5d9c9",
                  borderRadius: "7px",
                  boxShadow: "0 5px 14px rgba(33, 31, 27, 0.08)",
                  zIndex: 2000,
                  overflow: "hidden",
                  maxHeight: "230px",
                  overflowY: "auto",
                }}
              >
                {hasSearchSuggestions ? (
                  <>
                    {categorySuggestions.length > 0 && (
                      <div>
                        <div style={{ padding: "7px 12px 4px", fontSize: "9px", fontWeight: "700", color: "#9b672d", textTransform: "uppercase" }}>
                          Categories
                        </div>
                        {categorySuggestions.map((category) => (
                          <button
                            key={category.label}
                            type="button"
                            onClick={() => {
                              setSearch(category.label);
                              setShowSearchSuggestions(false);
                              navigate(category.path);
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              background: "transparent",
                              padding: "8px 12px",
                              minHeight: "34px",
                              textAlign: "left",
                              cursor: "pointer",
                              fontSize: "14px",
                              color: "#24211d",
                            }}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {productSuggestions.length > 0 && (
                      <div style={{ borderTop: categorySuggestions.length ? "1px solid #e5d9c9" : "none" }}>
                        <div style={{ padding: "7px 12px 4px", fontSize: "9px", fontWeight: "700", color: "#9b672d", textTransform: "uppercase" }}>
                          Products
                        </div>
                        {productSuggestions.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSearch(product.name);
                              setShowSearchSuggestions(false);
                              navigate(`/products/${product.id}`);
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              background: "transparent",
                              padding: "7px 12px",
                              minHeight: "42px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              textAlign: "left",
                              cursor: "pointer",
                              color: "#24211d",
                            }}
                          >
                            <img
                              src={product.image}
                              alt=""
                              style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "5px" }}
                            />
                            <span style={{ fontSize: "12px", fontWeight: "500" }}>
                              {product.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: "11px 12px", fontSize: "12px", color: "#716c64" }}>
                    No matching products or categories
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              style={{
                width: "54px",
                height: "100%",
                flexShrink: 0,
                border: "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Search
                size={22}
                strokeWidth={1.7}
                color="#9b672d"
              />
            </button>
          </div>

          {/* =================================================
              RIGHT ACTIONS
              ================================================= */}

          <div
            style={{
              width: "185px",
              flexShrink: 0,
              marginLeft: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* WISHLIST */}

            <div
              style={{
                width: "55px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#211f1b",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "24px",
                }}
              >
                <Heart
                  size={23}
                  strokeWidth={1.6}
                  color="#211f1b"
                />
              </div>

              <span
                style={{
                  marginTop: "4px",
                  fontSize: "11px",
                  fontWeight: "400",
                  lineHeight: "1",
                }}
              >
                Wishlist
              </span>
            </div>

            {/* CART */}

            <div
              style={{
                width: "45px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#211f1b",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "24px",
                  position: "relative",
                }}
              >
                <ShoppingCart
                  size={23}
                  strokeWidth={1.6}
                  color="#211f1b"
                />

                <span
                  style={{
                    position: "absolute",
                    top: "-9px",
                    right: "-10px",
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 4px",
                    borderRadius: "50%",
                    backgroundColor: "#b58243",
                    color: "#ffffff",
                    fontSize: "9px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  0
                </span>
              </div>

              <span
                style={{
                  marginTop: "4px",
                  fontSize: "11px",
                  fontWeight: "400",
                  lineHeight: "1",
                }}
              >
                Cart
              </span>
            </div>

            {/* ACCOUNT */}

            <div
              style={{
                width: "55px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#211f1b",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "24px",
                }}
              >
                <User
                  size={23}
                  strokeWidth={1.6}
                  color="#211f1b"
                />
              </div>

              <span
                style={{
                  marginTop: "4px",
                  fontSize: "11px",
                  fontWeight: "400",
                  lineHeight: "1",
                }}
              >
                Account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CATEGORY NAVIGATION
          ===================================================== */}

      <nav
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "#fffaf2",
          borderBottom: "1px solid #e5d9c9",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            height: "100%",
            margin: "0 auto",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              whiteSpace: "nowrap",
            }}
          >
            {categories.map((category) => (
              <span
                key={category.name}
                onClick={() => navigate(category.path)}
                style={{
                  flexShrink: 0,
                  color: "#211f1b",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "-0.1px",
                  lineHeight: "1",
                  cursor: "pointer",
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;