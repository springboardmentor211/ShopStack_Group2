import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import StarRating from './StarRating.jsx';
import { addToCart } from '../../../store/cartSlice.js';
import { toggleWishlist } from '../../../store/wishlistSlice.js';
import { formatCurrency, getDiscountPercent } from '../../../utils/formatCurrency.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.productId === product.productId);
  const discount = getDiscountPercent(product.price, product.mrp);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, quantity: 1 }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  return (
    <Link
      to={`/product/${product.productId}`}
      className="group relative flex flex-col bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
    >
      <button
        onClick={handleToggleWishlist}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1.5 shadow-sm"
      >
        <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : '#6b7280'} />
      </button>

      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-50 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.name}</h3>

      <StarRating rating={product.rating} count={product.ratingCount} />

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-base font-semibold text-gray-900">
          {formatCurrency(product.price)}
        </span>
        {discount > 0 && (
          <>
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.mrp)}
            </span>
            <span className="text-xs text-green-600 font-medium">{discount}% off</span>
          </>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className={`mt-3 w-full text-white text-sm font-medium py-2 rounded-md transition-colors ${
          justAdded ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {justAdded ? '✓ Added' : 'Add to Cart'}
      </button>
    </Link>
  );
}