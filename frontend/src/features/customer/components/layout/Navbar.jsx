import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Heart, ShoppingCart, ChevronDown, User, Menu, X, Package, LogOut } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";
import api from "../../../../services/api";
import logo from "../../../../assets/images/logo.png";
import { headerGradient } from "../../../../styles/theme";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { categories } = useCategories();
  const navigate = useNavigate();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = useSelector((state) => state.cart.items.length);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const categoryDropdownRef = useRef(null);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = !!user;
  const categoryOptions = ["All Categories", ...categories.map((c) => c.name)];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}
    logout();
    setShowAccountMenu(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({
      q: searchQuery,
      category: selectedCategory,
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      <div style={headerGradient} className="w-full">
        <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-9 px-4 md:px-6 py-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="ShopSphere" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:block relative min-w-0 flex-1 max-w-3xl">
            <div className="flex items-stretch h-10 rounded-md border border-gray-300">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for products, brands and more..."
                className="flex-1 min-w-0 px-4 text-sm outline-none bg-white rounded-l-md"
              />

              <div className="relative shrink-0" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategoryDropdown((v) => !v)}
                  className="flex items-center h-full px-3 border-l border-gray-300 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 whitespace-nowrap"
                >
                  {selectedCategory} <ChevronDown size={14} className="ml-1" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 text-sm z-50 max-h-64 overflow-y-auto">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedCategory === cat ? "text-blue-700 font-medium" : "text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-blue-700 hover:bg-blue-800 transition-colors px-5 text-white shrink-0 rounded-r-md"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-9 shrink-0 ml-auto">
            <Link to="/wishlist" className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-blue-700">
              <Heart size={20} />
              <span className="hidden lg:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-0.5 text-xs bg-blue-700 text-white rounded-full px-1.5">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-blue-700">
              <ShoppingCart size={20} />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 text-xs bg-blue-700 text-white rounded-full px-1.5">{cartCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setShowAccountMenu((v) => !v)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-800"
                >
                  <User size={18} />
                  Hi, {user?.name || "User"} <ChevronDown size={14} />
                </button>
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 p-1 text-sm">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-800 transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 text-gray-800 transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-blue-700">
                <User size={18} /> Login
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-4 ml-auto shrink-0">
            <button
              onClick={() => setShowMobileSearch((v) => !v)}
              className="flex items-center justify-center text-gray-800"
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setShowMobileMenu((v) => !v)}
              className="flex items-center justify-center text-gray-800"
            >
              {showMobileMenu ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-stretch h-10 bg-white rounded-md overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                className="flex-1 min-w-0 px-3 text-sm outline-none"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-blue-700 px-4 text-white shrink-0"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        )}

        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-1">
            <button
              onClick={() => setShowCategoryDropdown((v) => !v)}
              className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-800"
            >
              {selectedCategory} <ChevronDown size={16} />
            </button>

            {showCategoryDropdown && (
              <div className="pl-2 pb-2 space-y-1">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`block w-full text-left py-1 text-sm ${
                      selectedCategory === cat ? "text-blue-700 font-medium" : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <Link
              to="/wishlist"
              className="flex items-center gap-2 w-full py-2 text-sm font-medium text-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <Heart size={20} /> Wishlist
              {wishlistCount > 0 && (
                <span className="ml-1 text-xs bg-blue-700 text-white rounded-full px-1.5">{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 w-full py-2 text-sm font-medium text-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <ShoppingCart size={20} /> Cart
              {cartCount > 0 && (
                <span className="ml-1 text-xs bg-blue-700 text-white rounded-full px-1.5">{cartCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                <p className="flex items-center gap-2 py-2 text-sm font-medium text-gray-800">
                  <User size={18} /> Hi, {user?.name || "User"}
                </p>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-2 px-2 rounded-md text-sm font-medium text-gray-800 hover:bg-blue-50 transition-colors"
                >
                  <User size={16} /> My Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 py-2 px-2 rounded-md text-sm font-medium text-gray-800 hover:bg-blue-50 transition-colors"
                >
                  <Package size={16} /> My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left py-2 px-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 w-full py-2 text-sm font-medium text-gray-800">
                <User size={18} /> Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
