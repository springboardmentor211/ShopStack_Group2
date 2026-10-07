import { useState } from "react";
import Products from "./vendor/pages/Products";
import Orders from "./vendor/pages/Orders";

function App() {
  const [page, setPage] = useState("products");

  return (
    <div>
      {page === "products" && (
        <Products
          onOrdersClick={() => setPage("orders")}
        />
      )}

      {page === "orders" && (
        <Orders
          onProductsClick={() => setPage("products")}
        />
      )}
    </div>
  );
}

export default App;