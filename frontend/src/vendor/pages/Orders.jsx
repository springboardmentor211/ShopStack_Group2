
import React, { useMemo, useState, useEffect } from "react";
import { Download } from "lucide-react";

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

function Orders() {
  const [orders, setOrders] = useState(initialOrders);

  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("All dates");

  const [toast, setToast] = useState("");

  useEffect(() => {
    return () => {
      window.clearTimeout(window.shopstackOrdersToastTimer);
    };
  }, []);

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

    window.clearTimeout(window.shopstackOrdersToastTimer);

    window.shopstackOrdersToastTimer = window.setTimeout(() => {
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

    const nextStatus = {
      Pending: "Processing",
      Processing: "Shipped",
      Shipped: "Delivered",
      Delivered: "Delivered",
    };

    const updatedOrder = {
      ...selectedOrder,
      status: nextStatus[selectedOrder.status] || selectedOrder.status,
    };

    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id ? updatedOrder : order
      )
    );

    setSelectedOrder(updatedOrder);
    showToast(`Order status updated to ${updatedOrder.status}`);
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

    const escapeCsv = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.product,
      order.date,
      `₹${order.total}`,
      order.status,
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "orders.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);

    showToast("Orders exported successfully");
  };

  return (
    <div className="vendor-orders-app">
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

      {toast && (
        <div className="orders-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Orders;
