import React, { useMemo, useState } from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  BarChart3,
  Percent,
  Settings,
  Download,
  Store,
} from "lucide-react";

import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import OrderDetails from "../components/OrderDetails";
import ShipmentTracking from "../components/ShipmentTracking";

import "./Orders.css";

const initialOrders = [
  {
    id: "#ORD-1024",
    customer: "Ananya Rao",
    product: "Heritage Portable Speaker",
    date: "18 Sep 2026",
    total: 7499,
    status: "Processing",
  },
  {
    id: "#ORD-1023",
    customer: "Rahul Kumar",
    product: "Wireless Headphones",
    date: "18 Sep 2026",
    total: 3999,
    status: "Shipped",
  },
  {
    id: "#ORD-1022",
    customer: "Sneha Reddy",
    product: "Smart Watch",
    date: "17 Sep 2026",
    total: 5499,
    status: "Delivered",
  },
  {
    id: "#ORD-1021",
    customer: "Arjun Patel",
    product: "Bluetooth Speaker",
    date: "17 Sep 2026",
    total: 2499,
    status: "Pending",
  },
  {
    id: "#ORD-1020",
    customer: "Priya Sharma",
    product: "USB-C Hub",
    date: "16 Sep 2026",
    total: 1899,
    status: "Delivered",
  },
];

function Orders({ onProductsClick }) {
  const [orders, setOrders] = useState(initialOrders);

  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("All dates");

  const [toast, setToast] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchText) ||
        order.customer.toLowerCase().includes(searchText) ||
        order.product.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All statuses" ||
        order.status === statusFilter;

      const matchesDate =
        dateFilter === "All dates" ||
        order.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, statusFilter, dateFilter]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All statuses");
    setDateFilter("All dates");
  };

  const openOrder = (order) => {
    setSelectedOrder(order);
    setCurrentPage("details");
  };

  const openShipment = () => {
    setCurrentPage("shipment");
  };

  const backToOrders = () => {
    setSelectedOrder(null);
    setCurrentPage("orders");
  };

  const backToDetails = () => {
    setCurrentPage("details");
  };

  const updateOrderStatus = () => {
    if (!selectedOrder) return;

    let newStatus = selectedOrder.status;

    if (selectedOrder.status === "Pending") {
      newStatus = "Processing";
    } else if (selectedOrder.status === "Processing") {
      newStatus = "Shipped";
    } else if (selectedOrder.status === "Shipped") {
      newStatus = "Delivered";
    }

    const updatedOrder = {
      ...selectedOrder,
      status: newStatus,
    };

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder.id ? updatedOrder : order
      )
    );

    setSelectedOrder(updatedOrder);

    showToast(`Order status updated to ${newStatus}`);
  };

  const exportOrders = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Product",
      "Date",
      "Total",
      "Status",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.product,
      order.date,
      `₹${order.total}`,
      order.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("Orders exported successfully");
  };

  return (
    <div className="vendor-orders-app">

      {/* TOP UTILITY BAR */}
      <div className="vendor-utility-bar">
        <div>
          SHOPSTACK Vendor Centre • Manage your catalogue with confidence
        </div>

        <div>
          Vendor workspace
        </div>
      </div>

      {/* HEADER */}
      <header className="vendor-header">

        <div className="vendor-brand">
          <div className="vendor-brand-name">
            VENDOR CENTRE
          </div>

          <div className="vendor-logo">
            SHOPSTACK
          </div>
        </div>

        <div className="vendor-store">
          <Store size={17} />
          North & Form Store
        </div>

      </header>

      <div className="vendor-layout">

        {/* SIDEBAR */}
        <aside className="vendor-sidebar">

          <div className="vendor-sidebar-label">
            VENDOR PORTAL
          </div>

          <nav>

            <button
              type="button"
              className="vendor-nav-item"
              onClick={() =>
                showToast("Dashboard selected")
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className="vendor-nav-item"
              onClick={onProductsClick}
            >
              <Package size={18} />
              <span>Products</span>
            </button>

            <button
              type="button"
              className="vendor-nav-item active"
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </button>

            <button
              type="button"
              className="vendor-nav-item"
              onClick={() =>
                showToast("Inventory selected")
              }
            >
              <Boxes size={18} />
              <span>Inventory</span>
            </button>

            <button
              type="button"
              className="vendor-nav-item"
              onClick={() =>
                showToast("Analytics selected")
              }
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>

            {/* OFFERS & COUPONS */}
            <button
              type="button"
              className="vendor-nav-item"
              onClick={() =>
                showToast("Offers & Coupons selected")
              }
            >
              <Percent size={18} />
              <span>Offers &amp; Coupons</span>
            </button>

            <button
              type="button"
              className="vendor-nav-item"
              onClick={() =>
                showToast("Settings selected")
              }
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>

          </nav>

        </aside>

        {/* MAIN */}
        <main className="vendor-orders-main">

          {currentPage === "orders" && (
            <>
              <section className="orders-heading">

                <div>
                  <div className="orders-eyebrow">
                    ORDER MANAGEMENT
                  </div>

                  <h1>Orders</h1>

                  <p>
                    Manage and track your customer orders from one place.
                  </p>
                </div>

                <button
                  type="button"
                  className="export-button"
                  onClick={exportOrders}
                >
                  <Download size={16} />
                  Export Orders
                </button>

              </section>

              <OrdersFilters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />

              <OrdersTable
                orders={filteredOrders}
                onOpenOrder={openOrder}
                onResetFilters={resetFilters}
                totalOrders={orders.length}
              />
            </>
          )}

          {currentPage === "details" && selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onBack={backToOrders}
              onUpdateStatus={updateOrderStatus}
              onViewShipment={openShipment}
            />
          )}

          {currentPage === "shipment" && selectedOrder && (
            <ShipmentTracking
              order={selectedOrder}
              onBack={backToDetails}
            />
          )}

        </main>

      </div>

      {/* TOAST */}
      {toast && (
        <div className="orders-toast">
          {toast}
        </div>
      )}

    </div>
  );
}

export default Orders;