import React from 'react';
export default function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
        {rating.toFixed(1)} ★
      </span>
      {count != null && <span className="text-gray-500">({count.toLocaleString('en-IN')})</span>}
    </div>
  );
}