export const formatPrice = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;
