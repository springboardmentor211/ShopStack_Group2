import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../store/cartSlice";
import { resetWishlist } from "../../store/wishlistSlice";
=======
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import products from "../../shared/data/products";
>>>>>>> origin/warehouse-module
import { getUser, logout } from "../services/authService";
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

<<<<<<< HEAD
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search suggestions come from the products loaded from the backend.
  const products = useSelector((state) => state.products.items);
  const SEARCH_PRODUCTS = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
      })),
    [products]
  );
=======
// Search uses the shared product list (small thumbnails for suggestions).
const SEARCH_PRODUCTS = products.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  image: product.image.replace("w=1000", "w=200"),
}));

const Navbar = () => {
  const navigate = useNavigate();
>>>>>>> origin/warehouse-module
  // Cart badge shows the total number of items in the cart.
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const [search, setSearch] = useState("");

  // Account menu: logged-in users see their name and a Logout button.
  const [user, setUser] = useState(() => getUser());
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (!showAccountMenu) return undefined;
    const closeOnOutsideClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [showAccountMenu]);

  const handleAccountClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowAccountMenu((open) => !open);
  };

  const handleLogout = () => {
    logout();
<<<<<<< HEAD
    dispatch(resetCart());
    dispatch(resetWishlist());
=======
>>>>>>> origin/warehouse-module
    setUser(null);
    setShowAccountMenu(false);
    navigate("/");
  };

  const accountName = user?.name ? user.name.trim().split(" ")[0] : "";
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
              placeholder="Search for products"
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
              role="button"
              tabIndex={0}
              aria-label="Open wishlist"
              onClick={() => navigate("/wishlist")}
              onKeyDown={(event) => {
                if (event.key === "Enter") navigate("/wishlist");
              }}
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
              role="button"
              tabIndex={0}
              aria-label={`Open cart, ${cartCount} items`}
              onClick={() => navigate("/cart")}
              onKeyDown={(event) => {
                if (event.key === "Enter") navigate("/cart");
              }}
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
                  {cartCount > 99 ? "99+" : cartCount}
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

            <div ref={accountRef} style={{ position: "relative" }}>
              <div
                role="button"
                tabIndex={0}
                aria-label={user ? "Open account menu" : "Sign in"}
                aria-expanded={user ? showAccountMenu : undefined}
                onClick={handleAccountClick}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAccountClick();
                }}
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
                    maxWidth: "55px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user ? accountName || "Account" : "Sign in"}
                </span>
              </div>

              {user && showAccountMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    right: 0,
                    width: "220px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9c6ad",
                    borderRadius: "10px",
                    padding: "14px",
                    boxSizing: "border-box",
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#211f1b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name || "My Account"}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#716c64",
                      margin: "4px 0 14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email || user.phone}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      height: "38px",
                      border: "none",
                      borderRadius: "7px",
                      backgroundColor: "#211f1b",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
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