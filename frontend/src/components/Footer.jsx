import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, CreditCard } from "lucide-react";
import { headerGradient } from "../styles/theme";

const SHOP_LINKS = [
  { label: "New arrivals", path: "/new-arrivals" },
  { label: "Best sellers", path: "/best-sellers" },
  { label: "Deals", path: "/deals" },
  { label: "All categories", path: "/categories" },
];

const SERVICE_LINKS = [
  { label: "Track your order", path: "/orders/track" },
  { label: "Returns and refunds", path: "/returns" },
  { label: "Contact us", path: "/contact" },
];

export default function Footer() {
  return (
    <footer style={headerGradient} className="w-full mt-10">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
          <div className="sm:max-w-xs">
            <p className="font-semibold text-gray-900 mb-2">ShopSphere</p>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              One marketplace. Endless possibilities. Shop from thousands of trusted sellers.
            </p>
            <div className="flex gap-3 text-gray-700">
              <Facebook size={18} />
              <Instagram size={18} />
              <Twitter size={18} />
              <Youtube size={18} />
            </div>
          </div>

          <div className="flex gap-8 sm:gap-16">
            <FooterColumn title="Shop" links={SHOP_LINKS} />
            <FooterColumn title="Customer Service" links={SERVICE_LINKS} />
          </div>
        </div>

        <div className="border-t border-white/40 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-700">© 2026 ShopSphere. All rights reserved.</p>
          <div className="flex items-center gap-3 text-gray-700">
            <CreditCard size={20} />
            <span className="text-xs">Razorpay • Stripe • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="font-semibold text-gray-900 mb-2 text-sm">{title}</p>
      {links.map((l) => (
        <Link key={l.label} to={l.path} className="block text-xs text-gray-700 hover:text-blue-700 py-1">
          {l.label}
        </Link>
      ))}
    </div>
  );
}