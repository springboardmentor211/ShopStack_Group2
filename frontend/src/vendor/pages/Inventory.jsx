import "./Inventory.css";
import React, {
  useEffect,
  useMemo,
  useState
} from "react";
const API_URL = "http://localhost:8080/api/products";





function getStatus(stock) {

  if (stock === 0) {
    return "out";
  }

  if (stock <= 5) {
    return "low";
  }

  return "in";

}


function getStatusText(stock) {

  if (stock === 0) {
    return "Out of stock";
  }

  if (stock <= 5) {
    return "Low stock";
  }

  return "In stock";

}


function formatPrice(price) {

  return (
    "₹" +
    Number(price).toLocaleString("en-IN")
  );

}


/* PROFESSIONAL POPUP */

function Popup({
  popup,
  closePopup,
  confirmDelete
}) {

  if (!popup) {
    return null;
  }

  return (

    <div
      className="shop-popup-overlay"
      onMouseDown={closePopup}
    >

      <div
        className="shop-popup"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        <div
          className={
            "popup-icon " + popup.type
          }
        >
          {popup.icon}
        </div>


        <h3>
          {popup.title}
        </h3>


        <p>
          {popup.message}
        </p>


        <div className="popup-buttons">

          {popup.confirm ? (

            <>

              <button
                className="popup-btn cancel"
                onClick={closePopup}
              >
                Cancel
              </button>


              <button
                className="popup-btn delete"
                onClick={confirmDelete}
              >
                Delete
              </button>

            </>

          ) : (

            <button
              className="popup-btn primary"
              onClick={closePopup}
            >
              Done
            </button>

          )}

        </div>

      </div>

    </div>

  );

}


export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [searchText, setSearchText] =
    useState("");


  const [filter, setFilter] =
    useState("all");


  const [showAddModal, setShowAddModal] =
    useState(false);


  const [showStockModal, setShowStockModal] =
    useState(false);


  const [selectedProductId, setSelectedProductId] =
    useState(null);


  const [stockValue, setStockValue] =
    useState("");


  const [newProduct, setNewProduct] =
    useState({

      name: "",
      sku: "",
      category: "",
      price: "",
      stock: ""

    });


  const [popup, setPopup] =
    useState(null);


  /* SAVE PRODUCTS */
useEffect(() => {
  async function loadProducts() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
      setApiError("");
    } catch (error) {
      setApiError(
        "Unable to load products. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, []);


  /* STATISTICS */

  const statistics = useMemo(() => {

    return {

      total:
        products.length,

      inStock:
        products.filter(
          (product) =>
            product.stock > 5
        ).length,

      lowStock:
        products.filter(
          (product) =>
            product.stock > 0 &&
            product.stock <= 5
        ).length,

      outOfStock:
        products.filter(
          (product) =>
            product.stock === 0
        ).length

    };

  }, [products]);


  /* SEARCH + FILTER */

  const filteredProducts =
    useMemo(() => {

      const search =
        searchText
          .toLowerCase()
          .trim();


      return products.filter(
        (product) => {

          const matchesSearch =

            !search ||

            (product.name || "")
              .toLowerCase()
              .includes(search) ||

            (product.sku || "")
              .toLowerCase()
              .includes(search) ||

            (product.category || "")
              .toLowerCase()
              .includes(search);


          const matchesFilter =

            filter === "all" ||

            getStatus(product.stock) ===
              filter;


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      products,
      searchText,
      filter
    ]);


  /* POPUP */

  function showPopup(
    type,
    title,
    message
  ) {

    let icon = "!";

    if (type === "success") {
      icon = "✓";
    }

    if (type === "delete") {
      icon = "×";
    }

    setPopup({

      type,
      title,
      message,
      icon

    });

  }


  /* ADD PRODUCT - save to backend */

  async function addProduct() {
    const name = newProduct.name.trim();
    const sku = newProduct.sku.trim();
    const category = newProduct.category.trim();
    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);

    if (
      !name || !sku || !category ||
      newProduct.price === "" || newProduct.stock === "" ||
      !Number.isFinite(price) || price < 0 ||
      !Number.isInteger(stock) || stock < 0
    ) {
      showPopup(
        "warning",
        "Invalid Product Details",
        "Please enter valid product name, SKU, category, price and stock."
      );
      return;
    }

    const duplicateSKU = products.some(
      (product) => product.sku.toLowerCase() === sku.toLowerCase()
    );

    if (duplicateSKU) {
      showPopup("warning", "SKU Already Exists", "Please enter a unique SKU.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sku, category, price, stock })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to add product");
      }

      const savedProduct = await response.json();
      setProducts((current) => [...current, savedProduct]);
      setNewProduct({ name: "", sku: "", category: "", price: "", stock: "" });
      setShowAddModal(false);
      showPopup("success", "Product Added", `${name} has been successfully added to your inventory.`);
    } catch (error) {
      showPopup(
        "warning",
        "Product Not Added",
        "Could not save the product. Check the backend connection and make sure the SKU is unique."
      );
    }
  }


  /* UPDATE STOCK - save to backend */

  async function updateStock() {
    const quantity = Number(stockValue);

    if (stockValue === "" || !Number.isInteger(quantity) || quantity < 0) {
      showPopup("warning", "Invalid Stock Quantity", "Enter a whole number greater than or equal to 0.");
      return;
    }

    const product = products.find((item) => item.id === selectedProductId);
    if (!product) {
      showPopup("warning", "Product Not Found", "Please select a valid product.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, stock: quantity })
      });

      if (!response.ok) {
        throw new Error("Unable to update stock");
      }

      const updatedProduct = await response.json();
      setProducts((current) => current.map((item) =>
        item.id === selectedProductId ? updatedProduct : item
      ));
      setShowStockModal(false);
      showPopup("success", "Stock Updated", `${product.name} stock has been updated successfully.`);
    } catch (error) {
      showPopup(
        "warning",
        "Stock Not Updated",
        "Could not update stock. Confirm that your backend has a PUT /api/products/{id} endpoint."
      );
    }
  }


  /* DELETE CONFIRMATION */

  function askDelete(product) {

    setPopup({

      type: "delete",

      icon: "×",

      title: "Delete Product?",

      message:
        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,

      confirm: true,

      productId: product.id

    });

  }


  /* DELETE - remove from backend */

  async function confirmDelete() {
    if (!popup?.productId) return;

    const product = products.find((item) => item.id === popup.productId);

    try {
      const response = await fetch(`${API_URL}/${popup.productId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete product");
      }

      setProducts((current) => current.filter((item) => item.id !== popup.productId));
      setPopup(null);
      showPopup("success", "Product Deleted", `${product?.name || "Product"} has been removed from your inventory.`);
    } catch (error) {
      setPopup(null);
      showPopup(
        "warning",
        "Product Not Deleted",
        "Could not delete the product. Confirm that your backend has a DELETE /api/products/{id} endpoint."
      );
    }
  }


  return (

    <main className="main-content">

      {loading && <p className="api-message">Loading products...</p>}
      {apiError && <p className="api-message api-error">{apiError}</p>}

      {/* TITLE */}

      <div className="inventory-page-title">

        <div>

          <div className="page-label">
            INVENTORY MANAGEMENT
          </div>

          <h1>
            Inventory
          </h1>

          <p>
            Track stock levels, update quantities,
            and keep your catalogue ready to sell.
          </p>

        </div>


        <button
          className="dark-button"
          onClick={() =>
            setShowAddModal(true)
          }
        >
          + Add Product
        </button>

      </div>


      {/* STATISTICS */}

      <div className="inventory-stats">


        <div className="inventory-stat-card">
          <span>
            Total Products
          </span>

          <strong>
            {statistics.total}
          </strong>
        </div>


        <div className="inventory-stat-card">
          <span>
            In Stock
          </span>

          <strong className="green-text">
            {statistics.inStock}
          </strong>
        </div>


        <div className="inventory-stat-card">
          <span>
            Low Stock
          </span>

          <strong className="orange-text">
            {statistics.lowStock}
          </strong>
        </div>


        <div className="inventory-stat-card">
          <span>
            Out of Stock
          </span>

          <strong className="red-text">
            {statistics.outOfStock}
          </strong>
        </div>


      </div>


      {/* STOCK OVERVIEW */}

      <section className="inventory-table-card">


        <div className="inventory-table-header">

          <div>

            <h2>
              Stock Overview
            </h2>

            <p>
              Manage your current product inventory.
            </p>

          </div>


          <div className="inventory-filters">

            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
            />


            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Status
              </option>

              <option value="in">
                In stock
              </option>

              <option value="low">
                Low stock
              </option>

              <option value="out">
                Out of stock
              </option>

            </select>

          </div>

        </div>


        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <tr key={product.id}>

                      <td>
                        <strong>
                          {product.name}
                        </strong>
                      </td>

                      <td>
                        {product.sku}
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td>
                        {formatPrice(
                          product.price
                        )}
                      </td>

                      <td>
                        {product.stock} units
                      </td>

                      <td>

                        <span
                          className={
                            "status-badge status-" +
                            getStatus(
                              product.stock
                            )
                          }
                        >

                          {getStatusText(
                            product.stock
                          )}

                        </span>

                      </td>

                      <td>

                        <div className="action-group">

                          <button
                            className="table-action"
                            onClick={() => {

                              setSelectedProductId(
                                product.id
                              );

                              setStockValue(
                                String(
                                  product.stock
                                )
                              );

                              setShowStockModal(
                                true
                              );

                            }}
                          >
                            ✎
                          </button>


                          <button
                            className="table-action"
                            onClick={() =>
                              askDelete(product)
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        <div className="inventory-footer">

          Showing{" "}
          {filteredProducts.length} of{" "}
          {products.length} products

        </div>


      </section>


      {/* LOW STOCK */}

      <div className="low-stock-box">

        <div className="warning-icon">
          ⚠
        </div>

        <div>

          <h3>
            Low stock alert
          </h3>

          <p>

            {statistics.lowStock ===
            0

              ? "All products have sufficient stock."

              : `${statistics.lowStock} product${
                  statistics.lowStock > 1
                    ? "s are"
                    : " is"
                } running low on stock. Consider restocking soon.`}

          </p>

        </div>

      </div>


      {/* ADD PRODUCT MODAL */}

      {showAddModal && (

        <div
          className="modal show"
          onMouseDown={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="modal-content"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-title">

              <h2>
                Add Product
              </h2>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>

            </div>


            <label>
              Product Name
            </label>

            <input
              type="text"
              value={newProduct.name}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  name: event.target.value
                })
              }
            />


            <label>
              SKU
            </label>

            <input
              type="text"
              value={newProduct.sku}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  sku: event.target.value
                })
              }
            />


            <label>
              Category
            </label>

            <input
              type="text"
              value={newProduct.category}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  category:
                    event.target.value
                })
              }
            />


            <label>
              Price
            </label>

            <input
              type="number"
              min="0"
              value={newProduct.price}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  price:
                    event.target.value
                })
              }
            />


            <label>
              Stock
            </label>

            <input
              type="number"
              min="0"
              value={newProduct.stock}
              onChange={(event) =>
                setNewProduct({
                  ...newProduct,
                  stock:
                    event.target.value
                })
              }
            />


            <div className="modal-buttons">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>


              <button
                className="dark-button"
                onClick={addProduct}
              >
                Add Product
              </button>

            </div>

          </div>

        </div>

      )}


      {/* UPDATE STOCK MODAL */}

      {showStockModal && (

        <div
          className="modal show"
          onMouseDown={() =>
            setShowStockModal(false)
          }
        >

          <div
            className="modal-content"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-title">

              <h2>
                Update Stock
              </h2>

              <button
                onClick={() =>
                  setShowStockModal(false)
                }
              >
                ×
              </button>

            </div>


            <label>
              Product
            </label>

            <select
              value={
                selectedProductId || ""
              }
              onChange={(event) => {

                const id =
                  Number(
                    event.target.value
                  );

                const product =
                  products.find(
                    (item) =>
                      item.id === id
                  );

                setSelectedProductId(id);

                setStockValue(
                  String(
                    product?.stock || 0
                  )
                );

              }}
            >

              {products.map(
                (product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>

                )
              )}

            </select>


            <label>
              Stock Quantity
            </label>

            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(event) =>
                setStockValue(
                  event.target.value
                )
              }
            />


            <div className="modal-buttons">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowStockModal(false)
                }
              >
                Cancel
              </button>


              <button
                className="dark-button"
                onClick={updateStock}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}


      {/* POPUP */}

      <Popup
        popup={popup}
        closePopup={() =>
          setPopup(null)
        }
        confirmDelete={
          confirmDelete
        }
      />

    </main>

  );

}