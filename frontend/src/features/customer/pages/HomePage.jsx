import React from 'react';
import { Link } from 'react-router-dom';
import { categories, mockProducts } from '../data/mockProducts.js';
// import ProductCard from '../components/product/productCard.jsx';
import ProductCard from '../components/ProductCard.jsx';

const trustBadges = [
  { title: 'Free Delivery', subtitle: 'On orders above ₹499' },
  { title: 'Easy Returns', subtitle: '7 days return policy' },
  { title: 'Secure Payments', subtitle: '100% secure checkout' },
];

export default function homepage() {
  return (
    <div className="space-y-8">
        {/* <div className="flex gap-4 mb-4">
          <Link to="/wishlist" className="text-blue-600 underline">Go to Wishlist</Link>
          <Link to="/cart" className="text-blue-600 underline">Go to Cart</Link>
        </div> */}
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-teal-100 to-blue-200 rounded-lg p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">One Marketplace.</h1>
          <h1 className="text-3xl font-bold text-blue-700 mb-3">Endless Possibilities.</h1>
          <p className="text-gray-700 mb-5 max-w-md">
            Shop from thousands of trusted sellers and get what you love delivered to your door.
          </p>
          <Link
            to="/search?q=deals"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md"
          >
            Shop Now
          </Link>
        </div>
        <div className="hidden md:block text-6xl">🛍️</div>
      </section>

      {/* Trust badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges.map((badge) => (
          <div
            key={badge.title}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{badge.title}</p>
              <p className="text-xs text-gray-500">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by category */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop by Category</h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/search?q=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                🛒
              </div>
              <span className="text-xs text-gray-700 whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Hello User, What are you looking for?</h2>
          <Link to="/search?q=all" className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}