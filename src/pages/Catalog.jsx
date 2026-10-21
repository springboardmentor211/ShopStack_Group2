import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 11 Products
const INITIAL_PRODUCTS = [
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
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80'
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
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80'
  }
];

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProductForSuspend, setSelectedProductForSuspend] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-semibold">Active</span>;
      case 'Pending':
      case 'Under Review':
        return <span className="px-3 py-1 bg-[#FFF3E0] text-[#E65100] rounded-full text-xs font-semibold">Pending</span>;
      case 'Flagged':
        return <span className="px-3 py-1 bg-[#FFF8E1] text-[#F57F17] rounded-full text-xs font-semibold">Flagged</span>;
      case 'Suspended':
        return <span className="px-3 py-1 bg-[#FFEBEE] text-[#C62828] rounded-full text-xs font-semibold">Suspended</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const handleApprove = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p));
  };

  const handleFlag = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Flagged' } : p));
  };

  const confirmSuspend = () => {
    if (selectedProductForSuspend) {
      setProducts(prev => prev.map(p => p.id === selectedProductForSuspend.id ? { ...p, status: 'Suspended' } : p));
      setSelectedProductForSuspend(null);
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen p-6 font-sans text-[#2D241E]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1612]">Catalog Management</h1>
        <p className="text-xs text-[#8C827A] mt-1">Manage products, reviews, and catalog status</p>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3DA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE3DA] bg-[#FAF6F0]/60 text-xs text-[#8C827A]">
                <th className="py-4 px-4 font-semibold">Product</th>
                <th className="py-4 px-4 font-semibold">SKU / ID</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Seller</th>
                <th className="py-4 px-4 font-semibold">Price</th>
                <th className="py-4 px-4 font-semibold">Stock</th>
                <th className="py-4 px-4 font-semibold">Rating</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3DA] text-xs">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                  {/* Product Thumbnail + Name */}
                  <td className="py-3.5 px-4 font-medium text-[#1A1612]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF6F0] border border-[#EAE3DA] overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-semibold text-[#1A1612] line-clamp-1">{item.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#8C827A] font-mono">{item.id}</td>
                  <td className="py-3.5 px-4">{item.category}</td>
                  <td className="py-3.5 px-4 text-[#6B6158]">{item.seller}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1A1612]">{item.price}</td>
                  <td className="py-3.5 px-4">{item.stock}</td>
                  <td className="py-3.5 px-4 font-medium">{item.rating}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>

                  {/* ACTIONS COLUMN (TEXT BUTTONS) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/product-review/${item.id}`)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#1A1612] rounded-lg text-xs font-medium transition"
                      >
                        View
                      </button>

                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-medium transition"
                      >
                        Approve
                      </button>

                      {/* Flag Button */}
                      <button
                        onClick={() => handleFlag(item.id)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-medium transition"
                      >
                        Flag
                      </button>

                      {/* Suspend Button */}
                      <button
                        onClick={() => setSelectedProductForSuspend(item)}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUSPEND CONFIRMATION POPUP MODAL (Exact match with screenshot) */}
      {selectedProductForSuspend && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#EAE3DA]">
            <h2 className="text-2xl font-semibold text-[#1A1612] mb-3">Suspend Product</h2>
            <p className="text-sm text-[#70665F] mb-8">
              Suspend {selectedProductForSuspend.name} from the catalog?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProductForSuspend(null)}
                className="px-6 py-3 border border-[#EADFD5] rounded-xl text-sm font-semibold text-[#2D241E] hover:bg-[#FAF6F0] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspend}
                className="px-6 py-3 bg-[#1F1A17] hover:bg-black text-white rounded-xl text-sm font-medium transition shadow-md"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}