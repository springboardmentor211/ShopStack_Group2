import React, { useState } from "react";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Phone,
  PackageCheck,
} from "lucide-react";

function ShipmentTracking({ order, onBack }) {
  const [message, setMessage] = useState("");

  const trackingSteps = [
    "Order Confirmed",
    "Packed",
    "Shipped",
    "In Transit",
    "Delivered",
  ];

  const showMessage = () => {
    setMessage("Shipment tracking information updated.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="shipment-page">

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to Order Details
      </button>

      {/* Heading */}
      <section className="shipment-heading">

        <div>

          <div className="orders-eyebrow">
            ORDER MANAGEMENT
          </div>

          <h1>
            Shipment &amp; Tracking
          </h1>

          <p>
            Track the shipment status and delivery details
            for Order {order.id}.
          </p>

        </div>

        <span className="shipment-status">
          In Transit
        </span>

      </section>

      {/* Shipment details */}
      <section className="order-card">

        <div className="order-card-header">

          <div>

            <span className="order-card-eyebrow">
              SHIPMENT DETAILS
            </span>

            <h2>
              Shipment information
            </h2>

          </div>

          <Truck size={22} />

        </div>

        <div className="shipment-details-grid">

          <div>
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>

          <div>
            <span>Shipment ID</span>
            <strong>SHP-1024</strong>
          </div>

          <div>
            <span>Courier</span>
            <strong>Delhivery</strong>
          </div>

          <div>
            <span>Tracking ID</span>
            <strong>DEL102456789</strong>
          </div>

          <div>
            <span>Expected Delivery</span>
            <strong>21 Sep 2026</strong>
          </div>

        </div>

      </section>

      {/* Delivery tracking */}
      <section className="order-card">

        <div className="order-card-header">

          <div>

            <span className="order-card-eyebrow">
              DELIVERY TRACKING
            </span>

            <h2>
              Shipment progress
            </h2>

          </div>

          <PackageCheck size={22} />

        </div>

        <div className="shipment-progress">

          {trackingSteps.map((step, index) => (

            <div
              key={step}
              className={`shipment-step ${
                index <= 3 ? "active" : ""
              }`}
            >

              <div className="shipment-step-circle">
                {index + 1}
              </div>

              <span>
                {step}
              </span>

            </div>

          ))}

        </div>

      </section>

      {/* Address + Contact */}
      <div className="order-details-grid">

        <section className="order-card">

          <span className="order-card-eyebrow">
            SHIPPING ADDRESS
          </span>

          <h2>
            Delivery address
          </h2>

          <div className="address-block">

            <MapPin size={20} />

            <div>

              <strong>
                {order.customer}
              </strong>

              <span>
                Hyderabad
              </span>

              <span>
                Telangana, India
              </span>

            </div>

          </div>

        </section>

        <section className="order-card">

          <span className="order-card-eyebrow">
            CONTACT INFORMATION
          </span>

          <h2>
            Customer contact
          </h2>

          <div className="address-block">

            <Phone size={20} />

            <div>

              <strong>
                {order.customer}
              </strong>

              <span>
                +91 XXXXX XXXXX
              </span>

              <span>
                ananya@example.com
              </span>

            </div>

          </div>

        </section>

      </div>

      {/* Activity */}
      <section className="order-card">

        <div className="order-card-header">

          <div>

            <span className="order-card-eyebrow">
              SHIPMENT ACTIVITY
            </span>

            <h2>
              Recent updates
            </h2>

          </div>

        </div>

        <div className="shipment-activity">

          <div>
            <strong>18 Sep</strong>
            <span>Package picked up</span>
          </div>

          <div>
            <strong>18 Sep</strong>
            <span>Shipment dispatched</span>
          </div>

          <div>
            <strong>19 Sep</strong>
            <span>Shipment in transit</span>
          </div>

          <div>
            <strong>21 Sep</strong>
            <span>Expected delivery</span>
          </div>

        </div>

        <button
          type="button"
          className="primary-order-button"
          onClick={showMessage}
        >
          Track Shipment
        </button>

      </section>

      {message && (
        <div className="orders-toast">
          {message}
        </div>
      )}

    </div>
  );
}

export default ShipmentTracking;