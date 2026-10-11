// Fills the backend database with the Shop360 products, so the website has
// something to show. Run it once with the backend running:
//
//   node tools/seed-products.mjs
//   node tools/seed-products.mjs http://localhost:8081/api/v1   (different address)
//
// It registers a helper account (seed@shop360.local), logs in, and adds each
// product that is not already in the database. Safe to run again.
const BASE = process.argv[2] || "http://localhost:8081/api/v1";
const EMAIL = "seed@shop360.local";
const PASSWORD = "secret1";

const products = [
  {
    "name": "Premium Smartphone",
    "description": "A premium smartphone designed for everyday performance, entertainment, photography, and smooth multitasking.",
    "price": 49999,
    "oldPrice": 59999,
    "stockQuantity": 50,
    "category": "Mobiles",
    "imageUrl": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Slim Performance Laptop",
    "description": "A slim and powerful laptop built for productivity, study, entertainment, and everyday computing.",
    "price": 64999,
    "oldPrice": 74999,
    "stockQuantity": 50,
    "category": "Laptops",
    "imageUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Wireless Headphones",
    "description": "Enjoy immersive sound and comfortable wireless listening with these everyday headphones.",
    "price": 2499,
    "oldPrice": 3499,
    "stockQuantity": 50,
    "category": "Headphones",
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Smart Fitness Watch",
    "description": "A smart fitness watch for tracking daily activity while keeping you connected throughout the day.",
    "price": 3999,
    "oldPrice": 5999,
    "stockQuantity": 50,
    "category": "Smartwatches",
    "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Everyday Travel Backpack",
    "description": "A practical everyday backpack with enough space for work, college, travel, and daily essentials.",
    "price": 1499,
    "oldPrice": 2199,
    "stockQuantity": 50,
    "category": "Sports",
    "imageUrl": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Classic Everyday Style",
    "description": "A classic fashion choice designed to fit effortlessly into your everyday wardrobe.",
    "price": 1999,
    "oldPrice": 2999,
    "stockQuantity": 50,
    "category": "Fashion",
    "imageUrl": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Modern 4K Smart TV",
    "description": "A modern 4K smart TV with sharp picture quality and built-in apps for movies, shows, and gaming.",
    "price": 39999,
    "oldPrice": 49999,
    "stockQuantity": 50,
    "category": "TV",
    "imageUrl": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Premium Running Shoes",
    "description": "Lightweight running shoes with a cushioned sole, made for comfort on daily runs and workouts.",
    "price": 2799,
    "oldPrice": 3999,
    "stockQuantity": 50,
    "category": "Sports",
    "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Portable Bluetooth Speaker",
    "description": "A portable Bluetooth speaker with clear sound that is easy to carry to the park, trips, or a party.",
    "price": 1999,
    "oldPrice": 2999,
    "stockQuantity": 50,
    "category": "Electronics",
    "imageUrl": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Minimal Desk Lamp",
    "description": "A minimal desk lamp that gives soft, even light for studying, working, and late-night reading.",
    "price": 899,
    "oldPrice": 1299,
    "stockQuantity": 50,
    "category": "Home & Kitchen",
    "imageUrl": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Skincare Essentials Set",
    "description": "A skincare set with daily essentials to cleanse, moisturize, and protect your skin.",
    "price": 1299,
    "oldPrice": 1799,
    "stockQuantity": 50,
    "category": "Beauty",
    "imageUrl": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Classic Analog Watch",
    "description": "A classic analog watch with a clean dial that suits both everyday and formal outfits.",
    "price": 2499,
    "oldPrice": 3499,
    "stockQuantity": 50,
    "category": "Fashion",
    "imageUrl": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"
  },
  {
    "name": "Classic Book Collection",
    "description": "A collection of classic books, a great pick for avid readers and for gifting.",
    "price": 699,
    "oldPrice": 999,
    "stockQuantity": 50,
    "category": "Books",
    "imageUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80"
  }
];

const call = async (method, path, body, token) => {
  const response = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error((data && data.message) || response.status + " " + response.statusText);
  return data;
};

try {
  try {
    await call("POST", "/auth/register", { name: "Seed User", email: EMAIL, password: PASSWORD });
  } catch {
    // account already exists: fine
  }
  const { token } = await call("POST", "/auth/login", { email: EMAIL, password: PASSWORD });
  const existing = await call("GET", "/products", null, token);
  const names = new Set(existing.map((p) => p.name));

  for (const product of products) {
    if (names.has(product.name)) {
      console.log("skip (already there): " + product.name);
      continue;
    }
    await call("POST", "/products", product, token);
    console.log("added: " + product.name);
  }
  console.log("Done. Refresh the website.");
} catch (error) {
  console.error("Failed: " + error.message);
  console.error("Is the backend running at " + BASE + " ?");
  process.exit(1);
}
