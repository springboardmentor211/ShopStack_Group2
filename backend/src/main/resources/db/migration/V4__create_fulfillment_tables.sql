-- V4__create_fulfillment_tables.sql
--
-- Warehouse-owned floor state for the customer-side services (Order Desk, Pickup, Packup).
--
-- Deliberately NOT here: the order header, its status, its delivery date and its customer
-- snapshot. Those belong to the order module and are reached through OrderFulfillmentPort.
-- Storing a second copy of order.status in this schema is what the customer contract §7
-- forbids, so there is no status column in either table below.

CREATE TABLE order_pick_items (
    order_id      VARCHAR(20) NOT NULL,             -- ORD-78425; no FK, owned by order module
    warehouse_id  VARCHAR(20) NOT NULL REFERENCES warehouses(id),
    item_id       VARCHAR(30) NOT NULL,
    sku           VARCHAR(30) NOT NULL,
    qty           INTEGER     NOT NULL CHECK (qty > 0),
    picked        BOOLEAN     NOT NULL DEFAULT false,
    picked_at     TIMESTAMPTZ,
    picked_by     VARCHAR(100),
    PRIMARY KEY (order_id, item_id)
);
CREATE INDEX idx_pick_items_wh ON order_pick_items (warehouse_id, order_id);

CREATE TABLE order_packings (
    order_id      VARCHAR(20) PRIMARY KEY,
    warehouse_id  VARCHAR(20) NOT NULL REFERENCES warehouses(id),
    box_size      VARCHAR(10),                       -- small | medium | large
    weight_kg     NUMERIC(6,3) CHECK (weight_kg > 0),
    packed        BOOLEAN     NOT NULL DEFAULT false,
    packed_at     TIMESTAMPTZ,
    carrier       VARCHAR(60),
    tracking_id   VARCHAR(30),
    shipped       BOOLEAN     NOT NULL DEFAULT false,
    shipped_at    TIMESTAMPTZ
);
CREATE INDEX idx_packings_wh ON order_packings (warehouse_id);

-- Tracking ids look like BD-2938471: carrier prefix + sequence. Seeded high so the ids do
-- not collide with any real carrier numbering.
CREATE SEQUENCE tracking_seq START 2938471;
