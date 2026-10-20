import React from "react";
import { Search } from "lucide-react";

function OrdersFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  return (
    <section className="orders-filter-card">

      <div className="orders-filter-header">
        <span className="order-card-eyebrow">
          SEARCH ORDERS
        </span>

        <h2>Find an order</h2>
      </div>

      <div className="orders-filter-grid">

        <div className="orders-search-field">

          <label>
            Search orders
          </label>

          <div className="orders-search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Find an order"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

        </div>

        <div className="orders-filter-field">

          <label>
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>All statuses</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Pending</option>
          </select>

        </div>

        <div className="orders-filter-field">

          <label>
            Date
          </label>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
          >
            <option>All dates</option>
            <option>18 Sep 2026</option>
            <option>17 Sep 2026</option>
            <option>16 Sep 2026</option>
          </select>

        </div>

      </div>

    </section>
  );
}

export default OrdersFilters;