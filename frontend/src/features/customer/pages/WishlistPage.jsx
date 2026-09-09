import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../../store/wishlistSlice.js';
import { addToCart } from '../../../store/cartSlice.js';
import { formatCurrency, getDiscountPercent } from '../../../utils/formatCurrency.js';

export default function WishlistPage() {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          Your wishlist is empty. Tap the heart icon on any product to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => {
            const discount = getDiscountPercent(product.price, product.mrp);
            return (
              <div
                key={product.productId}
                className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4"
              >
                <Link to={`/product/${product.productId}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md bg-gray-50"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/product/${product.productId}`}>
                    <h3 className="text-sm font-medium text-gray-800 mb-1">{product.name}</h3>
                  </Link>

                  <div className="flex items-center gap-1 text-sm mb-1">
                    <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                      {product.rating.toFixed(1)} ★
                    </span>
                    <span className="text-gray-500">({product.ratingCount.toLocaleString('en-IN')})</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-base font-semibold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-green-600 font-medium">{discount}% OFF</span>
                    )}
                  </div>

                  <p className="text-xs text-green-600 mb-3">In Stock</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-md"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.productId)}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}