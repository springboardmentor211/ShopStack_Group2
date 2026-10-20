
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import "./Products.css";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import { initialProducts } from "../../data";

function Products() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("shopstack-products");

      // Use sample products if nothing is saved.
      if (!savedProducts) {
        localStorage.setItem(
          "shopstack-products",
          JSON.stringify(initialProducts)
        );
        return initialProducts.map((product) => ({ ...product }));
      }

      const parsedProducts = JSON.parse(savedProducts);

      // Use sample products if saved data is invalid.
      if (!Array.isArray(parsedProducts)) {
        localStorage.setItem(
          "shopstack-products",
          JSON.stringify(initialProducts)
        );
        return initialProducts.map((product) => ({ ...product }));
      }

      // Fix: replace an existing empty array with sample products.
      if (parsedProducts.length === 0) {
        localStorage.setItem(
          "shopstack-products",
          JSON.stringify(initialProducts)
        );
        return initialProducts.map((product) => ({ ...product }));
      }

      return parsedProducts.map((product, index) => ({
        ...product,
        id: product.id ?? Date.now() + index,
      }));
    } catch (error) {
      console.error("Error reading products:", error);
      return initialProducts.map((product) => ({ ...product }));
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        "shopstack-products",
        JSON.stringify(products)
      );
    } catch (error) {
      console.error("Error saving products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  useEffect(() => {
    return () => {
      window.clearTimeout(window.shopstackToastTimer);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);

    window.clearTimeout(window.shopstackToastTimer);

    window.shopstackToastTimer = window.setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const filteredProducts = products
    .filter((product) => {
      const name = product.name || "";
      const sku = product.sku || "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;

      const matchesStatus =
        !statusFilter || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );

    showToast("Product deleted.");
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts((current) =>
        current.map((item) =>
          item.id === editingProduct.id
            ? { ...product, id: editingProduct.id }
            : item
        )
      );

      showToast("Product updated successfully.");
    } else {
      setProducts((current) => [...current, product]);
      showToast("Product added successfully.");
    }

    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="products-page page-enter">
      <section
        className="products-content"
        aria-labelledby="products-heading"
      >
        <div className="page-heading">
          <div>
            <p className="eyebrow">Catalogue management</p>

            <h1 id="products-heading">Products</h1>

            <p className="page-description">
              Create, organise, and keep track of every product
              in your SHOPSTACK catalogue.
            </p>
          </div>

          <button
            type="button"
            className="button button-dark"
            onClick={handleAddProduct}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <section className="products-card card">
          <div className="products-card-header">
            <div>
              <h2>Your catalogue</h2>

              <p aria-live="polite">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product shown"
                  : "products shown"}
              </p>
            </div>

            {isLoading && (
              <span className="loading-indicator">
                Loading products…
              </span>
            )}
          </div>

          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
          />
        </section>
      </section>

      <div
        className={`panel-backdrop ${isFormOpen ? "open" : ""}`}
        onClick={handleCloseForm}
        aria-hidden="true"
      />

      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveProduct}
      />

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Products;
