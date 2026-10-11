import { useEffect, useState } from "react";
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  BarChart3,
  Percent,
  Settings,
  Plus,
} from "lucide-react";

import "./Products.css";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";

function Products({ onOrdersClick }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("shopstack-products");

    if (!savedProducts) {
      return [];
    }

    try {
      const parsedProducts = JSON.parse(savedProducts);

      return parsedProducts.map((product, index) => ({
        ...product,
        id: product.id ?? Date.now() + index,
      }));
    } catch (error) {
      console.error("Error reading products:", error);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "shopstack-products",
      JSON.stringify(products)
    );
  }, [products]);

  useEffect(() => {
    setIsLoading(false);
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
        categoryFilter === "" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "" ||
        product.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
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
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );

    showToast("Product deleted.");
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === editingProduct.id
            ? product
            : item
        )
      );

      showToast("Product updated successfully.");
    } else {
      setProducts((currentProducts) => [
        ...currentProducts,
        product,
      ]);

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
    <div className="products-page">
      {/* TOP UTILITY BAR */}
      <div className="utility-bar">
        <div className="workspace-wrap utility-content">
          <span className="utility-copy">
            SHOPSTACK Vendor Centre&nbsp; • &nbsp;
            Manage your catalogue with confidence
          </span>

          <span>Vendor workspace</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="vendor-header">
        <div className="workspace-wrap vendor-header-inner">
          <div>
            <p>Vendor Centre</p>
            <h2>SHOPSTACK</h2>
          </div>

          <div className="store-name">
            <Store size={17} />
            <span>North &amp; Form Store</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="workspace-wrap products-main page-enter">
        <div className="vendor-layout">
          {/* SIDEBAR */}
          <aside className="vendor-sidebar card">
            <p className="portal-label">
              Vendor portal
            </p>

            <button className="nav-item">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              className="nav-item active"
              aria-current="page"
            >
              <Package size={16} />
              <span>Products</span>
            </button>

            <button
              className="nav-item"
              onClick={onOrdersClick}
            >
              <ShoppingBag size={16} />
              <span>Orders</span>
            </button>

            <button className="nav-item">
              <Boxes size={16} />
              <span>Inventory</span>
            </button>

            <button className="nav-item">
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>

            {/* OFFERS & COUPONS */}
            <button className="nav-item">
              <Percent size={16} />
              <span>Offers &amp; Coupons</span>
            </button>

            <button className="nav-item">
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </aside>

          {/* CONTENT */}
          <section
            className="products-content"
            aria-labelledby="products-heading"
          >
            {/* HEADING */}
            <div className="page-heading">
              <div>
                <p className="eyebrow">
                  Catalogue management
                </p>

                <h1 id="products-heading">
                  Products
                </h1>

                <p className="page-description">
                  Create, organise, and keep track of
                  every product in your SHOPSTACK
                  catalogue.
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

            {/* FILTERS */}
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* TABLE */}
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

            <p className="page-message" />
          </section>
        </div>
      </main>

      {/* BACKDROP */}
      <div
        className={`panel-backdrop ${
          isFormOpen ? "open" : ""
        }`}
        onClick={handleCloseForm}
      />

      {/* FORM PANEL */}
      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveProduct}
      />

      {/* TOAST */}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Products;