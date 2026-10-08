// Single shared product list used by Home, Products, Deals, ProductDetails,
// Cart and Wishlist. Prices are numbers (in rupees) so totals can be calculated.
// Later, this file can be replaced by an API call to the backend.
const products = [
  {
    "id": "premium-smartphone",
    "category": "Mobiles",
    "name": "Premium Smartphone",
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.5",
    "reviews": "230",
    "price": 49999,
    "oldPrice": 59999,
    "discount": "17% OFF",
    "description": "A premium smartphone designed for everyday performance, entertainment, photography, and smooth multitasking."
  },
  {
    "id": "slim-performance-laptop",
    "category": "Laptops",
    "name": "Slim Performance Laptop",
    "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.7",
    "reviews": "189",
    "price": 64999,
    "oldPrice": 74999,
    "discount": "13% OFF",
    "description": "A slim and powerful laptop built for productivity, study, entertainment, and everyday computing."
  },
  {
    "id": "wireless-headphones",
    "category": "Headphones",
    "name": "Wireless Headphones",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.8",
    "reviews": "316",
    "price": 2499,
    "oldPrice": 3499,
    "discount": "29% OFF",
    "description": "Enjoy immersive sound and comfortable wireless listening with these everyday headphones."
  },
  {
    "id": "smart-fitness-watch",
    "category": "Smartwatches",
    "name": "Smart Fitness Watch",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.6",
    "reviews": "173",
    "price": 3999,
    "oldPrice": 5999,
    "discount": "33% OFF",
    "description": "A smart fitness watch for tracking daily activity while keeping you connected throughout the day."
  },
  {
    "id": "everyday-travel-backpack",
    "category": "Sports",
    "name": "Everyday Travel Backpack",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.7",
    "reviews": "102",
    "price": 1499,
    "oldPrice": 2199,
    "discount": "32% OFF",
    "description": "A practical everyday backpack with enough space for work, college, travel, and daily essentials."
  },
  {
    "id": "classic-everyday-style",
    "category": "Fashion",
    "name": "Classic Everyday Style",
    "image": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.5",
    "reviews": "158",
    "price": 1999,
    "oldPrice": 2999,
    "discount": "33% OFF",
    "description": "A classic fashion choice designed to fit effortlessly into your everyday wardrobe."
  },
  {
    "id": "modern-4k-smart-tv",
    "category": "TV",
    "name": "Modern 4K Smart TV",
    "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.6",
    "reviews": "145",
    "price": 39999,
    "oldPrice": 49999,
    "discount": "20% OFF",
    "description": "A modern 4K smart TV with sharp picture quality and built-in apps for movies, shows, and gaming."
  },
  {
    "id": "premium-running-shoes",
    "category": "Sports",
    "name": "Premium Running Shoes",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.7",
    "reviews": "198",
    "price": 2799,
    "oldPrice": 3999,
    "discount": "30% OFF",
    "description": "Lightweight running shoes with a cushioned sole, made for comfort on daily runs and workouts."
  },
  {
    "id": "portable-bluetooth-speaker",
    "category": "Electronics",
    "name": "Portable Bluetooth Speaker",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.8",
    "reviews": "267",
    "price": 1999,
    "oldPrice": 2999,
    "discount": "33% OFF",
    "description": "A portable Bluetooth speaker with clear sound that is easy to carry to the park, trips, or a party."
  },
  {
    "id": "minimal-desk-lamp",
    "category": "Home & Kitchen",
    "name": "Minimal Desk Lamp",
    "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.5",
    "reviews": "87",
    "price": 899,
    "oldPrice": 1299,
    "discount": "31% OFF",
    "description": "A minimal desk lamp that gives soft, even light for studying, working, and late-night reading."
  },
  {
    "id": "skincare-essentials-set",
    "category": "Beauty",
    "name": "Skincare Essentials Set",
    "image": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.6",
    "reviews": "124",
    "price": 1299,
    "oldPrice": 1799,
    "discount": "28% OFF",
    "description": "A skincare set with daily essentials to cleanse, moisturize, and protect your skin."
  },
  {
    "id": "classic-analog-watch",
    "category": "Fashion",
    "name": "Classic Analog Watch",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.7",
    "reviews": "211",
    "price": 2499,
    "oldPrice": 3499,
    "discount": "29% OFF",
    "description": "A classic analog watch with a clean dial that suits both everyday and formal outfits."
  },
  {
    "id": "classic-book-collection",
    "category": "Books",
    "name": "Classic Book Collection",
    "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80",
    "rating": "4.7",
    "reviews": "96",
    "price": 699,
    "oldPrice": 999,
    "discount": "30% OFF",
    "description": "A collection of classic books, a great pick for avid readers and for gifting."
  }
];

export const formatPrice = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

export const getProductById = (id) =>
  products.find((product) => product.id === id);

export default products;
