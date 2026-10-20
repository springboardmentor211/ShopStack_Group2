import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Same Product List Data
const PRODUCTS_DATA = [
  {
    id: 'PH-IPH15-128',
    name: 'iPhone 15 Smartphone',
    sku: 'PH-IPH15-128',
    category: 'Smartphones',
    seller: 'Northstar Tech Co.',
    price: '₹72,900',
    stock: 38,
    rating: 4.8,
    status: 'Active',
    description: 'Latest Apple iPhone 15 with Dynamic Island, 48MP Main Camera, and USB-C.',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'AB-AIR14-LAP',
    name: 'AirBook 14 Laptop',
    sku: 'AB-AIR14-LAP',
    category: 'Laptops',
    seller: 'Apex Tech Retailers',
    price: '₹64,990',
    stock: 17,
    rating: 4.7,
    status: 'Active',
    description: 'Thin and light powerful laptop with 14-inch retina display.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'SW-HEADPH-01',
    name: 'Studio Wireless Headphones',
    sku: 'SW-HEADPH-01',
    category: 'Audio',
    seller: 'SoundWave Tech Co.',
    price: '₹5,499',
    stock: 48,
    rating: 4.6,
    status: 'Pending',
    description: 'Active Noise Cancelling over-ear wireless headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'BP-EARBUD-PRO',
    name: 'Buds Pro Earbuds',
    sku: 'BP-EARBUD-PRO',
    category: 'Audio',
    seller: 'SoundWave Tech Co.',
    price: '₹4,999',
    stock: 60,
    rating: 4.5,
    status: 'Active',
    description: 'True wireless stereo earbuds with immersive spatial audio.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'PS-WATCH-01',
    name: 'Pulse Smartwatch',
    sku: 'PS-WATCH-01',
    category: 'Wearables',
    seller: 'Northstar Tech Co.',
    price: '₹3,499',
    stock: 50,
    rating: 4.3,
    status: 'Active',
    description: 'Fitness smartwatch with heart rate monitoring and sleep tracking.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'VS-TV-55',
    name: 'Vision 55 Television',
    sku: 'VS-TV-55',
    category: 'Television',
    seller: 'Home Electronics',
    price: '₹42,990',
    stock: 12,
    rating: 4.6,
    status: 'Pending',
    description: '54.6 inch 4K Ultra HD Smart LED TV with HDR support.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'SR-SNEAK-RUN',
    name: 'Stride Running Sneakers',
    sku: 'SR-SNEAK-RUN',
    category: 'Footwear',
    seller: 'Urban Outfitters',
    price: '₹2,999',
    stock: 80,
    rating: 4.4,
    status: 'Active',
    description: 'Comfortable mesh upper lightweight running shoes.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'UC-BACKPACK-01',
    name: 'Urban Commuter Backpack',
    sku: 'UC-BACKPACK-01',
    category: 'Bags',
    seller: 'Urban Outfitters',
    price: '₹1,899',
    stock: 100,
    rating: 4.2,
    status: 'Active',
    description: 'Water resistant laptop backpack with charging port.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'BM-BLENDER-01',
    name: 'BlendMate Kitchen Blender',
    sku: 'BM-BLENDER-01',
    category: 'Home Appliances',
    seller: 'Modern Home',
    price: '₹2,499',
    stock: 25,
    rating: 4.1,
    status: 'Pending',
    description: 'High speed smoothie blender with glass jar.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'NR-PARFUM-100ML',
    name: 'Noir Eau de Parfum',
    sku: 'NR-PARFUM-100ML',
    category: 'Fragrance',
    seller: 'Luxe Fragrances',
    price: '₹3,800',
    stock: 18,
    rating: 4.0,
    status: 'Suspended',
    description: 'Long lasting premium luxury perfume for men and women.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'DL-BOOKS-SET',
    name: 'The Design Library Books',
    sku: 'DL-BOOKS-SET',
    category: 'Books',
    seller: 'Paperback Publishers',
    price: '₹1,250',
    stock: 40,
    rating: 4.9,
    status: 'Active',
    description: 'Collection of 4 graphic design and UI/UX foundational books.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
  }
];

export default function ProductReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find product matching URL ID
  const product = PRODUCTS_DATA.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-[#FAF6F0] min-h-screen p-8 font-sans flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Product Not Found!</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="px-4 py-2 bg-[#1F1A17] text-white rounded-xl text-sm"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen p-6 font-sans text-[#2D241E]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white border border-[#EAE3DA] rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
      >
        ← Back to Catalog
      </button>

      {/* Main Review Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#EAE3DA] shadow-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-[#FAF6F0] border border-[#EAE3DA] rounded-2xl p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-80 object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-[#8C827A]">{product.id}</span>
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-semibold">
                  {product.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#1A1612] mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-[#1A1612] mb-4">{product.price}</p>

              <p className="text-sm text-[#70665F] mb-6">{product.description}</p>

              <div className="space-y-2 border-t border-[#EAE3DA] pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Category:</span>
                  <span className="font-semibold text-[#1A1612]">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Seller:</span>
                  <span className="font-semibold text-[#1A1612]">{product.seller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Stock Available:</span>
                  <span className="font-semibold text-[#1A1612]">{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Rating:</span>
                  <span className="font-semibold text-[#1A1612]">⭐ {product.rating}</span>
                </div>
              </div>
            </div>

            {/* Actions in Review Page */}
            <div className="flex gap-3 mt-8 border-t border-[#EAE3DA] pt-6">
              <button
                onClick={() => navigate('/catalog')}
                className="flex-1 py-3 border border-[#EADFD5] text-[#2D241E] rounded-xl text-xs font-semibold hover:bg-[#FAF6F0] transition"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}