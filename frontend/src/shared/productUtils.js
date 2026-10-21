// Shown when a product has no image.
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23f6f1e9'/></svg>";

// Finds the full product for a cart entry. If the product list does not have it
// (for example it was removed), falls back to what the cart itself returned.
export const resolveProduct = (entry, products) =>
  products.find((product) => product.id === entry.id) || {
    id: entry.id,
    name: entry.name || "Product",
    category: "",
    price: entry.unitPrice ?? 0,
    oldPrice: null,
    discount: null,
    rating: null,
    reviews: null,
    image: entry.imageUrl || PLACEHOLDER_IMAGE,
  };
