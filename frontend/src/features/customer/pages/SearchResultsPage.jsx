import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts.js';
// import ProductCard from '../components/product/productCard.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Using all mock products for now
  const results = mockProducts;

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Search results for "{query}"</h1>
      <p className="text-sm text-gray-500 mb-4">{results.length} products found</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}