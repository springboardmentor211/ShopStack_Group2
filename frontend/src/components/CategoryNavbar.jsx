import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useCategories } from "../context/CategoryContext";

const FIXED_LINKS = [
  { label: "Home", path: "/" },
  { label: "Deals", path: "/deals" },
  { label: "New Arrivals", path: "/new-arrivals" },
  { label: "Best Sellers", path: "/best-sellers" },
];

const DIRECT_CATEGORY_COUNT = 3;

export default function CategoryNavbar() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { categories, loading } = useCategories();
  const location = useLocation();

  const categoryMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setShowCategoryMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const directCategories = categories.slice(0, DIRECT_CATEGORY_COUNT);
  const moreCategories = categories.slice(DIRECT_CATEGORY_COUNT);

  const linkClass = (path) =>
    `whitespace-nowrap ${
      location.pathname === path ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-700"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 w-full relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-5 text-sm font-medium">
        <div className="relative" ref={categoryMenuRef}>
          <button
            onClick={() => setShowCategoryMenu((v) => !v)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700"
          >
            <Menu size={16} /> Categories <ChevronDown size={14} />
          </button>
          {showCategoryMenu && (
            <div className="absolute left-0 mt-2 w-[520px] max-w-[90vw] bg-white shadow-lg border border-gray-100 rounded-md grid grid-cols-2 gap-4 p-4 z-50">
              {loading && <p className="text-xs text-gray-400 col-span-2">Loading categories...</p>}
              {!loading && categories.length === 0 && (
                <p className="text-xs text-gray-400 col-span-2">No categories available</p>
              )}
              {categories.map((cat) => (
                <div key={cat.id}>
                  <p className="font-semibold text-gray-900 mb-1">{cat.name}</p>
                  {cat.subcategories?.map((s) => (
                    <Link
                      key={s.id}
                      to={`/category/${cat.id}/${s.id}`}
                      className="block text-xs text-gray-600 hover:text-blue-700 py-0.5"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {FIXED_LINKS.map((link) => (
          <Link key={link.label} to={link.path} className={linkClass(link.path)}>
            {link.label}
          </Link>
        ))}

        {directCategories.map((cat) => (
          <Link key={cat.id} to={`/category/${cat.id}`} className={linkClass(`/category/${cat.id}`)}>
            {cat.name}
          </Link>
        ))}

        <div className="relative ml-auto" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu((v) => !v)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-700"
          >
            More <ChevronDown size={14} />
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-100 rounded-md py-1 z-50">
              {moreCategories.length === 0 ? (
                <p className="px-4 py-2 text-xs text-gray-400">No more categories</p>
              ) : (
                moreCategories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    className="block px-4 py-2 text-xs hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}