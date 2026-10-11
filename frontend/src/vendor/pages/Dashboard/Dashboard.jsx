
import React from "react";
import "./Dashboard.css";


const dashboardData = {
  vendorName: "Vendor",

  summary: {
    totalRevenue: "₹1,24,580",
    revenueChange: "↑ 18.4% from last week",

    totalOrders: "186",
    ordersChange: "↑ 12.1% from last week",

    productsListed: "4",
    productsDescription: "Active catalogue items",

    lowStockItems: "0",
    lowStockDescription: "Need your attention",
  },

  revenue: {
    currentWeek: "₹1,24,580",

    /*
     * Later these values can come from the API.
     */
    chartData: [
      { day: "Mon", value: 4500 },
      { day: "Tue", value: 6500 },
      { day: "Wed", value: 5200 },
      { day: "Thu", value: 7200 },
      { day: "Fri", value: 5800 },
      { day: "Sat", value: 7200 },
      { day: "Sun", value: 6800 },
    ],
  },

  recentOrders: [
    {
      id: "#SH360-1842",
      customer: "Aarav Mehta",
      date: "18 Sep 2026",
      amount: "₹8,450",
      status: "Delivered",
    },
    {
      id: "#SH360-1841",
      customer: "Kavya Iyer",
      date: "18 Sep 2026",
      amount: "₹2,199",
      status: "Processing",
    },
    {
      id: "#SH360-1840",
      customer: "Rohan Kapoor",
      date: "17 Sep 2026",
      amount: "₹5,799",
      status: "Delivered",
    },
    {
      id: "#SH360-1839",
      customer: "Nisha Sharma",
      date: "17 Sep 2026",
      amount: "₹3,650",
      status: "Shipped",
    },
  ],

  lowStockProducts: [
    {
      name: "Organic Cotton Kurta",
      sku: "NF-KRT-OLV-M",
      unitsLeft: 3,
    },
    {
      name: "Brass Table Lamp",
      sku: "NF-LMP-BRS-01",
      unitsLeft: 5,
    },
  ],
};


/*
 * =========================================================
 * STAT CARD COMPONENT
 * =========================================================
 */

const StatCard = ({ title, value, description, type, icon }) => {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <h3>{title}</h3>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <p className="stat-value">
        {value}
      </p>

      <p className={`stat-change ${type}`}>
        {description}
      </p>

    </div>
  );
};


/*
 * =========================================================
 * RECENT ORDERS COMPONENT
 * =========================================================
 */

const RecentOrders = ({ orders }) => {
  return (
    <div className="orders-card">

      <div className="card-title">

        <div>
          <p className="section-label">
            ORDER ACTIVITY
          </p>

          <h3>
            Recent Orders
          </h3>
        </div>

        <span className="title-icon">
          ▤
        </span>

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

          <div
            className="table-row"
            key={order.id}
          >

            <strong>
              {order.id}
            </strong>

            <span>
              {order.customer}
            </span>

            <span>
              {order.date}
            </span>

            <strong>
              {order.amount}
            </strong>

            <span
              className={`status ${order.status.toLowerCase()}`}
            >
              {order.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};


/*
 * =========================================================
 * LOW STOCK COMPONENT
 * =========================================================
 */

const LowStockAlerts = ({ products }) => {
  return (
    <div className="inventory-card">

      <div className="card-title">

        <div>
          <p className="section-label">
            INVENTORY WATCH
          </p>

          <h3>
            Low Stock Alerts
          </h3>
        </div>

        <span className="title-icon">
          ◈
        </span>

      </div>


      {products.map((product) => (

        <div
          className="stock-item"
          key={product.sku}
        >

          <div>

            <h4>
              {product.name}
            </h4>

            <p>
              SKU: {product.sku}
            </p>

          </div>


          <div className="stock-right">

            <strong>
              {product.unitsLeft} units left
            </strong>

            <span>
              Critical
            </span>

          </div>

        </div>

      ))}

    </div>
  );
};


/*
 * =========================================================
 * DASHBOARD
 * =========================================================
 */

const Dashboard = () => {

  const {
    vendorName,
    summary,
    revenue,
    recentOrders,
    lowStockProducts,
  } = dashboardData;


  return (
    <div className="vendor-dashboard">


      {/* =================================================
          PAGE INTRO
      ================================================= */}

      <section className="dashboard-intro">

        <div>

          <p className="section-label">
            BUSINESS OVERVIEW
          </p>

          <h2>
            Welcome back, {vendorName}
          </h2>

          <p className="intro-text">
            Here is a clear view of your store performance,
            latest orders, and inventory priorities.
          </p>

        </div>


        <button className="date-filter">
          Last 7 days
        </button>

      </section>


      {/* =================================================
          STAT CARDS
      ================================================= */}

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


      {/* =================================================
          PERFORMANCE / REVENUE
      ================================================= */}

      <section className="performance-card">

        <div className="card-heading">

          <div>

            <p className="section-label">
              PERFORMANCE
            </p>

            <h3>
              Revenue Overview
            </h3>

          </div>


          <div className="weekly-revenue">
            ↗ {revenue.currentWeek} this week
          </div>

        </div>


        <div className="chart">

          <div className="y-axis">

            <span>
              ₹8k
            </span>

            <span>
              ₹0
            </span>

          </div>


          <div className="chart-area">

            <div className="chart-line">

              {revenue.chartData
                .slice(0, 6)
                .map((point, index) => (

                  <span
                    key={point.day}
                    className={`point p${index + 1}`}
                    title={`${point.day}: ₹${point.value}`}
                  />

                ))}

            </div>


            <div className="chart-labels">

              {revenue.chartData.map((point) => (

                <span key={point.day}>
                  {point.day}
                </span>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          LOWER SECTION
      ================================================= */}

      <section className="dashboard-bottom">

        <RecentOrders
          orders={recentOrders}
        />

        <LowStockAlerts
          products={lowStockProducts}
        />

      </section>

    </div>
  );
};


export default Dashboard;

