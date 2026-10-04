import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, CheckCircle2, ClipboardList, MapPin, Package, PackageCheck, Truck } from 'lucide-react'
import './FulfillmentPage.css'

const stages = [
  { id: 'PICKING', label: 'Picking' },
  { id: 'PACKING', label: 'Packing' },
  { id: 'OUTBOUND', label: 'Outbound & Shipping' },
]

const outboundStatuses = [
  "PENDING",
  "CONFIRMED",
  "PICKED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];
const outboundQueueStatuses = [
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];
const statusNames = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PICKED: "Picked",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

function dueLabel(date) {
  if (!date) return "No delivery date";
  return `Due ${new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T00:00:00`))}`;
}

function ProductImage({ item }) {
  return (
    <span
      className="fulfillment-product__image"
      style={{ "--product-tint": item.tint }}
    >
      <Package size={17} aria-hidden="true" />
      <img
        src={item.image}
        alt=""
        onError={(event) => {
          event.currentTarget.hidden = true;
        }}
      />
    </span>
  );
}

function pickedQuantity(item) {
  return Number.isInteger(item.pickedQuantity)
    ? item.pickedQuantity
    : item.picked ? item.quantity : 0
}

function OutboundWorkspace({ orders, onUpdateOrder }) {
  const outboundOrders = useMemo(
    () =>
      orders.filter((order) => outboundQueueStatuses.includes(order.status)),
    [orders],
  );
  const [selectedId, setSelectedId] = useState("");
  const selectedOrder =
    outboundOrders.find((order) => order.id === selectedId) ??
    outboundOrders[0];
  const [deliveryDateDraft, setDeliveryDateDraft] = useState(
    selectedOrder?.deliveryDate ?? "",
  );
  const packedCount = outboundOrders.filter(
    (order) => order.status === "PACKED",
  ).length;
  const itemCount =
    selectedOrder?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  useEffect(() => {
    setDeliveryDateDraft(selectedOrder?.deliveryDate ?? "");
  }, [selectedOrder?.id, selectedOrder?.deliveryDate]);

  if (!selectedOrder) {
    return (
      <div className="fulfillment-empty">
        <Truck size={24} />
        <strong>No orders in outbound</strong>
        <span>Packed orders will appear here.</span>
      </div>
    );
  }

  function createShipment() {
    const trackingNumber =
      selectedOrder.trackingNumber ||
      `S360-${selectedOrder.orderNumber.slice(-5)}`;
    onUpdateOrder(selectedOrder.id, { status: "SHIPPED", trackingNumber });
  }

  function saveDeliveryDate() {
    onUpdateOrder(selectedOrder.id, { deliveryDate: deliveryDateDraft });
  }

  const currentStep = outboundStatuses.indexOf(selectedOrder.status);

  return (
    <div className="fulfillment-outbound">
      <div className="fulfillment-outbound__queue" aria-label="Outbound orders">
        {outboundOrders.map((order) => (
          <button
            className={`fulfillment-shipment-card${selectedOrder.id === order.id ? " fulfillment-shipment-card--selected" : ""}`}
            key={order.id}
            type="button"
            onClick={() => setSelectedId(order.id)}
            aria-pressed={selectedOrder.id === order.id}
          >
            <span className="fulfillment-shipment-card__top">
              <strong>{order.orderNumber}</strong>
              <span
                className={`fulfillment-status fulfillment-status--${order.status.toLowerCase()}`}
              >
                {statusNames[order.status]}
              </span>
            </span>
            <span>
              {order.carrier ||
                (order.status === "PACKED"
                  ? "No carrier yet"
                  : order.carrierName || "Carrier assigned")}
            </span>
            <small>
              {order.trackingNumber ||
                `No tracking number yet · ${dueLabel(order.deliveryDate)}`}
            </small>
          </button>
        ))}
      </div>

      <article className="fulfillment-shipment-detail">
        <div className="fulfillment-shipment-detail__heading">
          <div>
            <Truck size={18} />
            <h3>
              {selectedOrder.orderNumber} · {selectedOrder.customer.name}
            </h3>
          </div>
          <span
            className={`fulfillment-status fulfillment-status--${selectedOrder.status.toLowerCase()}`}
          >
            {statusNames[selectedOrder.status]}
          </span>
        </div>

        <section className="fulfillment-address">
          <span>
            <MapPin size={12} /> Deliver to
          </span>
          <strong>{selectedOrder.customer.address}</strong>
          <small>{selectedOrder.customer.phone}</small>
        </section>

        <div className="fulfillment-shipment-facts">
          <div>
            <span>Carrier</span>
            <strong>{selectedOrder.carrier || "Not assigned"}</strong>
          </div>
          <div>
            <span>Tracking</span>
            <strong>{selectedOrder.trackingNumber || "Not created"}</strong>
          </div>
          <div>
            <span>Units</span>
            <strong>{itemCount}</strong>
          </div>
          <div>
            <span>Delivery date</span>
            <strong>
              {dueLabel(selectedOrder.deliveryDate).replace("Due ", "")}
            </strong>
          </div>
          <div>
            <span>Packed at</span>
            <strong>{selectedOrder.packStation || "Pack Sta. 2"}</strong>
          </div>
        </div>

        <div className="fulfillment-shipment-products">
          {selectedOrder.items.map((item, index) => (
            <div
              className="fulfillment-shipment-product"
              key={`${item.sku}-${index}`}
            >
              <ProductImage item={item} />
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.sku} · {item.quantity}
                </small>
              </span>
            </div>
          ))}
        </div>

        <div
          className="fulfillment-timeline"
          aria-label={`Order status: ${statusNames[selectedOrder.status]}`}
        >
          {outboundStatuses.map((status, index) => (
            <div
              className={`fulfillment-timeline__step${index < currentStep ? " fulfillment-timeline__step--complete" : ""}${index === currentStep ? " fulfillment-timeline__step--current" : ""}`}
              key={status}
            >
              <span>
                {index < currentStep ? <Check size={12} /> : index + 1}
              </span>
              <small>{statusNames[status]}</small>
            </div>
          ))}
        </div>

        <p className="fulfillment-shipment-hint">
          {selectedOrder.status === "PACKED"
            ? "Packed and ready to ship. Choose a carrier to create the shipment and tracking number."
            : `Shipment status: ${statusNames[selectedOrder.status].toLowerCase()}.`}
        </p>
        <div className="fulfillment-carrier-control">
          <label htmlFor="shipment-carrier">Carrier</label>
          <div>
            <select
              id="shipment-carrier"
              value={selectedOrder.carrier ?? ""}
              onChange={(event) =>
                onUpdateOrder(selectedOrder.id, { carrier: event.target.value })
              }
            >
              <option value="">Select carrier</option>
              <option value="FedEx">FedEx</option>
              <option value="DHL">DHL</option>
              <option value="UPS">UPS</option>
              <option value="Blue Dart">Blue Dart</option>
            </select>
            <button
              className="fulfillment-primary"
              type="button"
              disabled={
                selectedOrder.status !== "PACKED" || !selectedOrder.carrier
              }
              onClick={createShipment}
            >
              Create shipment
            </button>
          </div>
        </div>
        <div className="fulfillment-date-control">
          <label htmlFor="shipment-delivery-date">
            Delivery date shown to customer
          </label>
          <div>
            <span>
              <input
                id="shipment-delivery-date"
                type="date"
                value={deliveryDateDraft}
                onChange={(event) => setDeliveryDateDraft(event.target.value)}
              />
              <CalendarDays size={14} />
            </span>
            <button
              className="fulfillment-secondary"
              type="button"
              disabled={
                deliveryDateDraft === (selectedOrder.deliveryDate ?? "")
              }
              onClick={saveDeliveryDate}
            >
              Save date
            </button>
          </div>
        </div>
        <span className="fulfillment-packed-count">
          {packedCount} packed {packedCount === 1 ? "order" : "orders"} awaiting
          shipment
        </span>
      </article>
    </div>
  );
}

function FulfillmentPage({ orders, onUpdateOrder, onOpenOrderDesk }) {
  const [stage, setStage] = useState("PICKING");
  const [notice, setNotice] = useState("");
  const pickingOrders = useMemo(
    () => orders.filter((order) => order.status === "CONFIRMED"),
    [orders],
  );
  const packingOrders = useMemo(
    () => orders.filter((order) => order.status === "PICKED"),
    [orders],
  );
  const activeOrders = stage === "PICKING" ? pickingOrders : packingOrders;

  function markItemPicked(order, itemIndex) {
    const items = order.items.map((item, index) =>
      index === itemIndex
        ? (() => {
            const currentQuantity = pickedQuantity(item)
            const pickLimit = Math.min(item.quantity, item.stock ?? item.quantity)
            const nextQuantity = currentQuantity >= pickLimit
              ? currentQuantity - 1
              : currentQuantity + 1
            return {
              ...item,
              pickedQuantity: nextQuantity,
              picked: nextQuantity === item.quantity,
            }
          })()
        : item,
    );
    onUpdateOrder(order.id, { items });
  }

  function markAllPicked(order) {
    onUpdateOrder(order.id, {
      items: order.items.map((item) => {
        const quantity = Math.min(item.quantity, item.stock ?? item.quantity)
        return { ...item, pickedQuantity: quantity, picked: quantity === item.quantity }
      }),
    });
  }

  function completePicking(order) {
    const shortage = order.items.find((item) => pickedQuantity(item) < item.quantity)
    if (shortage) {
      setNotice(
        shortage.stock < shortage.quantity
          ? `${shortage.name} is short on stock. Resolve the shortage before completing this pick.`
          : `Pick all ${shortage.quantity} units of ${shortage.name} before completing this order.`,
      );
      return;
    }
    onUpdateOrder(order.id, { status: "PICKED" });
    setNotice(`${order.orderNumber} is ready for packing.`);
  }

  function completePacking(order) {
    if (!order.packStation) {
      setNotice(`Choose a pack station for ${order.orderNumber} first.`);
      return;
    }
    onUpdateOrder(order.id, { status: "PACKED", packedAt: new Date().toISOString() });
    setNotice(`${order.orderNumber} has been packed.`);
  }

  const counts = {
    PICKING: pickingOrders.length,
    PACKING: packingOrders.length,
    OUTBOUND: orders.filter((order) => order.status === "PACKED").length,
  };

  return (
    <main className="fulfillment-page">
      <header className="fulfillment-heading">
        <div>
          <h1>Picking, Packing &amp; Outbound</h1>
          <p>Move confirmed orders from the shelf to a packed parcel.</p>
        </div>
        <button
          className="fulfillment-order-desk"
          type="button"
          onClick={onOpenOrderDesk}
        >
          Order desk
        </button>
      </header>

      <nav className="fulfillment-stages" aria-label="Fulfillment stages">
        {stages.map(({ id, label }) => (
          <button
            className={`fulfillment-stage${stage === id ? " fulfillment-stage--active" : ""}`}
            key={id}
            type="button"
            aria-pressed={stage === id}
            onClick={() => {
              setStage(id);
              setNotice("");
            }}
          >
            {label} <span>{counts[id]}</span>
          </button>
        ))}
      </nav>

      <section className="fulfillment-panel" aria-live="polite">
        <div className="fulfillment-panel__heading">
          <div>
            <h2>
              {stage === "PICKING"
                ? "Picking progress"
                : stage === "PACKING"
                  ? "Ready to pack"
                  : "Outbound & shipping"}
            </h2>
            <p>
              {stage === "PICKING"
                ? "Collect each item from its bin, then complete the pick."
                : stage === "PACKING"
                  ? "Orders picked from inventory are waiting for a pack station."
                  : "Create shipments and track parcels on their way to customers."}
            </p>
          </div>
          {stage === "PICKING" ? (
            <ClipboardList size={21} aria-hidden="true" />
          ) : stage === "PACKING" ? (
            <PackageCheck size={21} aria-hidden="true" />
          ) : (
            <Truck size={21} aria-hidden="true" />
          )}
        </div>

        {stage === "OUTBOUND" ? (
          <OutboundWorkspace orders={orders} onUpdateOrder={onUpdateOrder} />
        ) : activeOrders.length ? (
          <div className="fulfillment-orders">
            {activeOrders.map((order) => {
              const pickedCount = order.items.reduce(
                (total, item) => total + pickedQuantity(item),
                0,
              );
              const itemCount = order.items.reduce(
                (total, item) => total + item.quantity,
                0,
              );
              const progress = itemCount
                ? Math.round((pickedCount / itemCount) * 100)
                : 0;
              const allPicked = pickedCount === itemCount;
              const hasStockShortage = order.items.some(
                (item) => item.stock < item.quantity,
              );

              return (
                <article className="fulfillment-order" key={order.id}>
                  {stage === "PICKING" ? (
                    <>
                      <div className="fulfillment-order__summary">
                        <div>
                          <h3>
                            {order.orderNumber}
                            <span> · {order.customer.name}</span>
                          </h3>
                          <p>
                            {dueLabel(order.deliveryDate)} · {pickedCount} of{" "}
                            {itemCount} units picked
                          </p>
                        </div>
                        <strong className="fulfillment-progress-label">
                          {progress}%
                        </strong>
                      </div>
                      <div
                        className="fulfillment-progress"
                        role="progressbar"
                        aria-label={`${order.orderNumber} picked`}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={progress}
                      >
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      {hasStockShortage && (
                        <p className="fulfillment-shortage" role="alert">
                          Stock shortage: at least one item has fewer units available than ordered.
                        </p>
                      )}
                      <div className="fulfillment-items">
                        {order.items.map((item, index) => (
                          <div
                            className="fulfillment-product"
                            key={`${item.sku}-${index}`}
                          >
                            <ProductImage item={item} />
                            <div className="fulfillment-product__details">
                              <strong>
                                {item.name} <span>× {item.quantity}</span>
                              </strong>
                              <small>
                                {item.sku} · bin {item.bin}
                              </small>
                            </div>
                            <button
                              className={`fulfillment-pick${pickedQuantity(item) === item.quantity ? " fulfillment-pick--done" : ""}`}
                              type="button"
                              disabled={
                                pickedQuantity(item) < item.quantity &&
                                pickedQuantity(item) === 0 &&
                                (item.stock ?? item.quantity) === 0
                              }
                              aria-label={
                                pickedQuantity(item) === item.quantity
                                  ? `Undo one picked unit of ${item.name}`
                                  : `Pick one unit of ${item.name}`
                              }
                              onClick={() => markItemPicked(order, index)}
                            >
                              {pickedQuantity(item) === item.quantity ? (
                                <>
                                  <Check size={14} /> Undo 1
                                </>
                              ) : (
                                item.stock !== undefined &&
                                pickedQuantity(item) >= item.stock
                                  ? pickedQuantity(item) > 0 ? "Undo 1" : "Short stock"
                                  : `Pick ${pickedQuantity(item)}/${item.quantity}`
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="fulfillment-order__actions">
                        <button
                          className="fulfillment-primary"
                          type="button"
                          disabled={!allPicked}
                          onClick={() => completePicking(order)}
                        >
                          Complete picking
                        </button>
                        <button
                          className="fulfillment-secondary"
                          type="button"
                          onClick={() => markAllPicked(order)}
                        >
                          Pick available units
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="fulfillment-pack-row">
                      <div className="fulfillment-pack-row__items">
                        <strong>{order.orderNumber}</strong>
                        <span>
                          {itemCount} {itemCount === 1 ? "unit" : "units"} ·{" "}
                          {order.customer.name}
                        </span>
                        <div className="fulfillment-pack-thumbnails">
                          {order.items.map((item, index) => (
                            <ProductImage
                              key={`${item.sku}-${index}`}
                              item={item}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="fulfillment-pack-row__actions">
                        <span className="fulfillment-picked-badge">Picked</span>
                        <label className="fulfillment-pack-station">
                          <span>Pack station</span>
                          <select
                            value={order.packStation ?? ""}
                            onChange={(event) =>
                              onUpdateOrder(order.id, { packStation: event.target.value })
                            }
                            aria-label={`Pack station for ${order.orderNumber}`}
                          >
                            <option value="">Select station</option>
                            <option value="Pack Sta. 1">Pack Sta. 1</option>
                            <option value="Pack Sta. 2">Pack Sta. 2</option>
                            <option value="Pack Sta. 3">Pack Sta. 3</option>
                          </select>
                        </label>
                        <button
                          className="fulfillment-primary"
                          type="button"
                          disabled={!order.packStation}
                          onClick={() => completePacking(order)}
                        >
                          Mark packed
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="fulfillment-empty">
            <CheckCircle2 size={24} aria-hidden="true" />
            <strong>
              {stage === "PICKING"
                ? "No orders waiting to be picked"
                : "No orders waiting to be packed"}
            </strong>
            <span>
              {stage === "PICKING"
                ? "Newly confirmed orders will appear here."
                : "Complete a pick to send an order to packing."}
            </span>
          </div>
        )}
      </section>
      {notice && (
        <div className="fulfillment-notice" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}

export default FulfillmentPage;
