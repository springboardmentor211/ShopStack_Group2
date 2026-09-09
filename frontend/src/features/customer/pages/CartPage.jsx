import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../store/cartSlice.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal - total;

  const handleQuantityChange = (productId, newQty) => {
    dispatch(updateQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-semibold mb-4">My Cart</h1>
        <p className="text-gray-500">
          Your cart is empty. <Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">My Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md bg-gray-50 shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="px-3 py-1 text-lg"
                    >
                      −
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="px-3 py-1 text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-500">
                    <button className="hover:text-blue-600">Save for later</button>
                    <span>|</span>
                    <button onClick={() => handleRemove(item.productId)} className="hover:text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price details */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 h-fit">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Price Details</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Price ({items.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">− {formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-semibold text-sm">
            <span>Total Amount</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md mt-4">
            Proceed to Checkout
          </button>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Have a coupon code?</p>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border rounded-md px-2 py-1.5 text-sm"
              />
              <button className="text-blue-600 text-sm font-medium">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}