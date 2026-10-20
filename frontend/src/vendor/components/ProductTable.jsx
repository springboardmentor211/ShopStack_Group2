import { useState } from "react";
import {
  Package,
  Pencil,
  Trash2,
  Check,
  X,
  PackageSearch,
} from "lucide-react";

function ProductTable({
  products,
  onDelete,
  onEdit,
  onAdd,
}) {
  const [confirmingId, setConfirmingId] =
    useState(null);

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "status-active";
    }

    if (status === "Draft") {
      return "status-draft";
    }

    return "status-out";
  };

  return (
    <>
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <PackageSearch size={24} />
          </div>

          <h3>No products found</h3>

          <p>
            Try adjusting your filters or add a new
            product to your catalogue.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const isConfirming =
                  confirmingId === product.id;

                return (
                  <tr
                    key={product.id}
                    className="product-row"
                  >
                    <td>
                      <div className="product-cell">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-thumb"
                          />
                        ) : (
                          <div
                            className="product-thumb"
                            aria-hidden="true"
                          >
                            <Package size={20} />
                          </div>
                        )}

                        <div className="product-text">
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.imageUrl
                              ? "Image URL attached"
                              : "No image URL"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="product-sku">
                      {product.sku}
                    </td>

                    <td>{product.category}</td>

                    <td className="product-price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {product.stock} units
                    </td>

                    <td>
                      <span
                        className={`status ${getStatusClass(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>
                      <div className="row-actions">
                        {!isConfirming ? (
                          <>
                            <button
                              type="button"
                              className="row-action"
                              aria-label={`Edit ${product.name}`}
                              title="Edit product"
                              onClick={() =>
                                onEdit(product)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="row-action delete-action"
                              aria-label={`Delete ${product.name}`}
                              title="Delete product"
                              onClick={() =>
                                setConfirmingId(
                                  product.id
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="delete-confirmation">
                            <button
                              type="button"
                              className="confirm-delete"
                              onClick={() => {
                                onDelete(product.id);
                                setConfirmingId(null);
                              }}
                            >
                              <Check size={14} />
                              Confirm
                            </button>

                            <button
                              type="button"
                              className="cancel-delete"
                              onClick={() =>
                                setConfirmingId(null)
                              }
                            >
                              <X size={14} />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ProductTable;