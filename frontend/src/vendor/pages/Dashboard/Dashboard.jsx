import React from "react";
import "./Dashboard.css";

import {
  dashboardData,
  recentOrders,
  lowStockProducts,
} from "../../../data";

const StatCard = ({ title, value, description, type, icon }) => (
  <div className="stat-card">
    <div className="stat-card-top">
      <h3>{title}</h3>
      <div className="stat-icon">{icon}</div>
    </div>
    <p className="stat-value">{value}</p>
    <p className={`stat-change ${type}`}>{description}</p>
  </div>
);

const RecentOrders = ({ orders }) => (
  <div className="orders-card">
    <div className="card-title">
      <div>
        <p className="section-label">ORDER ACTIVITY</p>
        <h3>Recent Orders</h3>
      </div>
      <span className="title-icon">▤</span>
    </div>

    <div className="orders-table">
      <div className="table-header">
        <span>ORDER ID</span>
        <span>CUSTOMER</span>
        <span>DATE</span>
        <span>AMOUNT</span>
        <span>STATUS</span>
      </div>

      {orders.map((order) => (
        <div className="table-row" key={order.id}>
          <strong>{order.id}</strong>
          <span>{order.customer}</span>
          <span>{order.date}</span>
          <strong>{order.amount}</strong>
          <span className={`status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LowStockAlerts = ({ products }) => (
  <div className="inventory-card">
    <div className="card-title">
      <div>
        <p className="section-label">INVENTORY WATCH</p>
        <h3>Low Stock Alerts</h3>
      </div>
      <span className="title-icon">◈</span>
    </div>

    {products.map((product) => (
      <div className="stock-item" key={product.sku}>
        <div>
          <h4>{product.name}</h4>
          <p>SKU: {product.sku}</p>
        </div>

        <div className="stock-right">
          <strong>{product.unitsLeft} units left</strong>
          <span>Critical</span>
        </div>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const { vendorName, summary, revenue } = dashboardData;

  return (
    <div className="vendor-dashboard">
      <section className="dashboard-intro">
        <div>
          <p className="section-label">BUSINESS OVERVIEW</p>
          <h2>Welcome back, {vendorName}</h2>
          <p className="intro-text">
            Here is a clear view of your store performance, latest orders,
            and inventory priorities.
          </p>
        </div>

        <button className="date-filter" type="button">
          Last 7 days
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          title="TOTAL REVENUE"
          value={summary.totalRevenue}
          description={summary.revenueChange}
          type="positive"
          icon="₹"
        />

        <StatCard
          title="TOTAL ORDERS"
          value={summary.totalOrders}
          description={summary.ordersChange}
          type="positive"
          icon="▣"
        />

        <StatCard
          title="PRODUCTS LISTED"
          value={summary.productsListed}
          description={summary.productsDescription}
          type="normal"
          icon="◇"
        />

        <StatCard
          title="LOW STOCK ITEMS"
          value={summary.lowStockItems}
          description={summary.lowStockDescription}
          type="warning"
          icon="△"
        />
      </section>

      <section className="performance-card">
        <div className="card-heading">
          <div>
            <p className="section-label">PERFORMANCE</p>
            <h3>Revenue Overview</h3>
          </div>

          <div className="weekly-revenue">
            ↗ {revenue.currentWeek} this week
          </div>
        </div>

        <div className="chart">
          <div className="y-axis">
            <span>₹8k</span>
            <span>₹0</span>
          </div>

          <div className="chart-area">
            <div className="chart-line">
              {revenue.chartData.slice(0, 6).map((point, index) => (
                <span
                  key={point.day}
                  className={`point p${index + 1}`}
                  title={`${point.day}: ₹${point.value}`}
                />
              ))}
            </div>

            <div className="chart-labels">
              {revenue.chartData.map((point) => (
                <span key={point.day}>{point.day}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-bottom">
        <RecentOrders orders={recentOrders} />
        <LowStockAlerts products={lowStockProducts} />
      </section>
    </div>
  );
};

export default Dashboard;