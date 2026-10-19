import { Search } from "lucide-react";

function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <section className="filters-card card">
      <div className="toolbar-grid">
        <div>
          <label htmlFor="productSearch">
            Search products
          </label>

          <div className="search-wrapper">
            <Search
              size={16}
              className="search-icon"
            />

            <input
              id="productSearch"
              className="field search-field"
              type="search"
              placeholder="Search by product name or SKU"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor="categoryFilter">
            Category
          </label>

          <select
            id="categoryFilter"
            className="field"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="">
              All categories
            </option>

            <option value="Accessories">
              Accessories
            </option>

            <option value="Beauty">
              Beauty
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Home & Kitchen">
              Home & Kitchen
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter">
            Status
          </label>

          <select
            id="statusFilter"
            className="field"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="">
              All statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Out of stock">
              Out of stock
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default ProductFilters;