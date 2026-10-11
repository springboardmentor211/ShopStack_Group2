import { formatPrice } from "../../shared/format";
import { resolveProduct } from "../../shared/productUtils";
import { card, sectionTitle } from "../../shared/ui";

// Joins cart entries ({ id, quantity }) with product details and adds the total.
export const getCartDetails = (cartItems, products = []) => {
  const items = cartItems
    .map((entry) => ({ ...entry, product: resolveProduct(entry, products) }));
  const total = items.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  return { items, total };
};

const OrderSummary = ({ items, total }) => (
  <div style={card}>
    <h2 style={sectionTitle}>Order Summary</h2>

    {items.map(({ id, quantity, product }) => (
      <div key={id} style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            borderRadius: "8px",
            backgroundColor: "#f6f1e9",
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#211f1b" }}>
            {product.name}
          </div>
          <div style={{ fontSize: "13px", color: "#716c64", margin: "3px 0" }}>
            Qty {quantity}
          </div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#211f1b" }}>
            {formatPrice(product.price * quantity)}
          </div>
        </div>
      </div>
    ))}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid #e5d9c9",
        paddingTop: "16px",
        marginTop: "6px",
        fontSize: "16px",
        fontWeight: "700",
        color: "#211f1b",
      }}
    >
      <span>Total</span>
      <span>{formatPrice(total)}</span>
    </div>
  </div>
);

export default OrderSummary;
