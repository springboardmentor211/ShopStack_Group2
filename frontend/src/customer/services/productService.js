import api from "../../shared/api/client";
import { PLACEHOLDER_IMAGE } from "../../shared/productUtils";

const toNumber = (value) => (value == null ? null : Number(value));

// Converts a product from the API into the shape the pages use.
// oldPrice, rating and reviews are optional: the pages hide them when missing.
export const toProduct = (p) => {
  const price = toNumber(p.price);
  const oldPrice = toNumber(p.oldPrice);
  const hasDiscount = oldPrice != null && oldPrice > price;

  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    category: p.category || "",
    image: p.imageUrl || PLACEHOLDER_IMAGE,
    price,
    oldPrice: hasDiscount ? oldPrice : null,
    discount: hasDiscount
      ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`
      : null,
    rating: p.averageRating ? Number(p.averageRating).toFixed(1) : null,
    reviews: p.totalReviews || null,
    stock: p.stockQuantity ?? null,
  };
};

// GET /products (public)
export const fetchProducts = async () => {
  const { data } = await api.get("/products");
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.filter((p) => p.active !== false).map(toProduct);
};
