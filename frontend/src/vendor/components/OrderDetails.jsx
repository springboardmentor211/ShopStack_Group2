import React from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Circle,
} from "lucide-react";

function OrderDetails({
  order,
  onBack,
  onUpdateStatus,
  onViewShipment,
}) {
  const steps = [
    "Order Placed",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStatusIndex = {
    Pending: 0,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
  };

  const currentIndex =
    currentStatusIndex[order.status] ?? 0;

  return (
    <div className="order-details-page">

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to Orders
      </button>

      {/* Heading */}
      <section className="order-details-heading">

        <div>

          <div className="orders-eyebrow">
            ORDER MANAGEMENT
          </div>

          <h1>
            Order {order.id}
          </h1>

          <div className="order-details-meta">

            <span>
              Order date: <strong>{order.date}</strong>
            </span>

            <span>
              Payment: <strong>Paid</strong>
            </span>

            <span>
              Customer: <strong>{order.customer}</strong>
            </span>

          </div>

        </div>

        <span
          className={`status-badge status-${order.status.toLowerCase()}`}
        >
          {order.status}
        </span>

      </section>

      {/* Items + Summary */}
      <div className="order-details-grid">

        <section className="order-card">

          <div className="order-card-header">

            <div>
              <span className="order-card-eyebrow">
                ORDER ITEMS
              </span>

              <h2>
                Products
              </h2>
            </div>

            <Package size={22} />

          </div>

          <div className="order-item">

            <div className="order-item-image">
              <div className="speaker-placeholder">
                <Package size={28} />
              </div>
            </div>

            <div className="order-item-info">

              <h3>
                {order.product}
              </h3>

              <p>
                SKU: HSP-SPEK-WAL-04
              </p>

              <p>
                Quantity: 1
              </p>

            </div>

            <div className="order-item-price">
              ₹{order.total.toLocaleString("en-IN")}
            </div>

          </div>

        </section>

        <section className="order-card">

          <div className="order-card-header">

            <div>
              <span className="order-card-eyebrow">
                ORDER SUMMARY
              </span>

              <h2>
                Payment summary
              </h2>
            </div>

          </div>

          <div className="order-summary">

            <div className="order-summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{order.total.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="order-summary-row">
              <span>Shipping</span>
              <strong>₹0</strong>
            </div>

            <div className="order-summary-row">
              <span>Tax</span>
              <strong>₹0</strong>
            </div>

            <div className="order-summary-row order-summary-total">
              <span>Total</span>
              <strong>
                ₹{order.total.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* Customer information */}
      <div className="order-details-grid">

        <section className="order-card">

          <span className="order-card-eyebrow">
            CUSTOMER INFORMATION
          </span>

          <h2>
            Customer details
          </h2>

          <div className="customer-info">

            <div className="customer-info-row">
              <span>Name</span>
              <strong>{order.customer}</strong>
            </div>

            <div className="customer-info-row">
              <span>Email</span>
              <strong>ananya@example.com</strong>
            </div>

            <div className="customer-info-row">
              <span>Phone</span>
              <strong>+91 XXXXX XXXXX</strong>
            </div>

          </div>

        </section>

        <section className="order-card">

          <span className="order-card-eyebrow">
            SHIPPING ADDRESS
          </span>

          <h2>
            Delivery address
          </h2>

          <div className="customer-info">

            <div className="customer-info-row">
              <span>Customer</span>
              <strong>{order.customer}</strong>
            </div>

            <div className="customer-info-row">
              <span>City</span>
              <strong>Hyderabad</strong>
            </div>

            <div className="customer-info-row">
              <span>State / Country</span>
              <strong>Telangana, India</strong>
            </div>

          </div>

        </section>

      </div>

      {/* Progress */}
      <section className="order-card">

        <div className="order-card-header">

          <div>
            <span className="order-card-eyebrow">
              ORDER PROGRESS
            </span>

            <h2>
              Track order
            </h2>
          </div>

          <Truck size={22} />

        </div>

        <div className="order-progress">

          {steps.map((step, index) => {

            const completed = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={step}
                className={`order-progress-step ${
                  completed ? "completed" : ""
                } ${current ? "current" : ""}`}
              >

                <div className="order-progress-circle">

                  {completed ? (
                    <CheckCircle2 size={16} />
                  ) : current ? (
                    <Circle size={14} />
                  ) : (
                    index + 1
                  )}

                </div>

                <span>
                  {step}
                </span>

              </div>
            );
          })}

        </div>

        <div className="order-detail-actions">

          <button
            type="button"
            className="primary-order-button"
            onClick={onUpdateStatus}
          >
            Update Order Status
          </button>

          <button
            type="button"
            className="secondary-order-button"
            onClick={onViewShipment}
          >
            View Shipment
          </button>

        </div>

      </section>

    </div>
  );
}

export default OrderDetails;