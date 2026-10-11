import React from "react";
import { SearchX, ArrowRight } from "lucide-react";

function OrdersTable({
  orders,
  onOpenOrder,
  onResetFilters,
  totalOrders,
}) {
  return (
    <section className="order-card">

      <div className="order-card-header">

        <div>
          <span className="order-card-eyebrow">
            RECENT ORDERS
          </span>

          <h2>
            Orders
            <span className="orders-count">
              {orders.length}
            </span>
          </h2>
        </div>

        <div className="orders-total-count">
          {totalOrders} total
        </div>

      </div>

      {orders.length === 0 ? (

        <div className="orders-empty">

          <SearchX size={38} />

          <h3>
            No orders found
          </h3>

          <p>
            Try a different search or adjust your filters
            to see matching orders.
          </p>

          <button
            type="button"
            onClick={onResetFilters}
          >
            Reset filters
          </button>

        </div>

      ) : (

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCTS</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  <td>
                    <span className="order-id">
                      {order.id}
                    </span>
                  </td>

                  <td>
                    <span className="order-customer">
                      {order.customer}
                    </span>
                  </td>

                  <td>
                    <span className="order-product">
                      {order.product}
                    </span>
                  </td>

                  <td>
                    {order.date}
                  </td>

                  <td>
                    <span className="order-total">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>

                    <button
                      type="button"
                      className="order-action-button"
                      onClick={() =>
                        onOpenOrder(order)
                      }
                    >
                      View
                      <ArrowRight size={14} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default OrdersTable;