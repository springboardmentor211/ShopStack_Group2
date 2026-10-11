import { useEffect, useState } from "react";
import { X } from "lucide-react";

function ProductForm({
  product,
  isOpen,
  onClose,
  onSave,
}) {
  const [formMessage, setFormMessage] =
    useState("");

  useEffect(() => {
    setFormMessage("");
  }, [product, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const productName =
      form.productName.value.trim();

    const imageUrl =
      form.imageUrl.value.trim();

    const sku =
      form.productSku.value.trim().toUpperCase();

    const category =
      form.productCategory.value;

    const price =
      Number(form.productPrice.value);

    const stock =
      Number(form.productStock.value);

    const status =
      form.productStatus.value;

    if (
      !productName ||
      !sku ||
      !category ||
      Number.isNaN(price) ||
      Number.isNaN(stock)
    ) {
      setFormMessage(
        "Please complete all required product details."
      );

      return;
    }

    const newProduct = {
      id: product?.id ?? Date.now(),
      name: productName,
      imageUrl,
      sku,
      category,
      price,
      stock,
      status,
    };

    onSave(newProduct);
  };

  return (
    <aside
      className={`form-panel ${
        isOpen ? "open" : ""
      }`}
      aria-hidden={!isOpen}
    >
      <div className="form-panel-header">
        <div>
          <p className="eyebrow">
            Vendor catalogue
          </p>

          <h2>
            {product ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <button
          type="button"
          className="row-action close-panel-button"
          aria-label="Close product form"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <form
        className="product-form-content"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="productName">
            Product name
          </label>

          <input
            id="productName"
            name="productName"
            className="field"
            type="text"
            defaultValue={product?.name || ""}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">
            Product image URL
          </label>

          <input
            id="imageUrl"
            name="imageUrl"
            className="field"
            type="url"
            defaultValue={product?.imageUrl || ""}
          />

          <p className="field-help">
            Add an optional image reference for your
            product record.
          </p>
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="productSku">
              SKU
            </label>

            <input
              id="productSku"
              name="productSku"
              className="field"
              type="text"
              defaultValue={product?.sku || ""}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productCategory">
              Category
            </label>

            <select
              id="productCategory"
              name="productCategory"
              className="field"
              defaultValue={
                product?.category || ""
              }
              required
            >
              <option value="">
                Select category
              </option>

              <option>Accessories</option>
              <option>Beauty</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Kitchen</option>
            </select>
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="productPrice">
              Price (₹)
            </label>

            <input
              id="productPrice"
              name="productPrice"
              className="field"
              type="number"
              min="0"
              step="0.01"
              defaultValue={
                product?.price ?? ""
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productStock">
              Stock
            </label>

            <input
              id="productStock"
              name="productStock"
              className="field"
              type="number"
              min="0"
              step="1"
              defaultValue={
                product?.stock ?? ""
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="productStatus">
            Status
          </label>

          <select
            id="productStatus"
            name="productStatus"
            className="field"
            defaultValue={
              product?.status || "Active"
            }
            required
          >
            <option>Active</option>
            <option>Draft</option>
            <option>Out of stock</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="button button-dark save-button"
          >
            {product
              ? "Update Product"
              : "Save Product"}
          </button>

          <button
            type="button"
            className="button button-soft"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        {formMessage && (
          <p className="form-message" role="status">
            {formMessage}
          </p>
        )}
      </form>
    </aside>
  );
}

export default ProductForm;