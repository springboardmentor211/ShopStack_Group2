-- V5__seed_dev_fulfillment_data.sql
--
-- Dev/test seed only, standing in for the `order` module.
--
-- WHY THIS EXISTS: the order module is still empty, so OrderFulfillmentPort has no real
-- implementation. StubOrderFulfillmentPort reads these two tables so the customer-side
-- screens have real rows to page, filter and transition.
--
-- TODO(order module lands): delete dev_orders, dev_order_items, the Dev* entities and
-- repositories, and StubOrderFulfillmentPort; supply the real OrderFulfillmentPort
-- implementation. Nothing in the warehouse module references these tables directly, so
-- that swap touches only the port package.
--
-- Also seeded here: inventory_rows, because the Pick flow decrements real stock. Without
-- it every pick would fail the "not enough stock" check and binLocation/stockOnHand would
-- be null on the customer-side screens.

CREATE TABLE dev_orders (
    id              VARCHAR(20) PRIMARY KEY,        -- ORD-78421
    warehouse_id    VARCHAR(20) NOT NULL REFERENCES warehouses(id),
    status          VARCHAR(20) NOT NULL,           -- lower-case OrderStatus wire form
    delivery_date   DATE,
    placed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    customer_name   VARCHAR(100) NOT NULL,
    customer_phone  VARCHAR(30),
    address_line    VARCHAR(200),
    city            VARCHAR(100),
    version         INTEGER NOT NULL DEFAULT 0      -- optimistic lock on status writes
);

CREATE TABLE dev_order_items (
    order_id     VARCHAR(20) NOT NULL REFERENCES dev_orders(id),
    item_id      VARCHAR(30) NOT NULL,
    sku          VARCHAR(30) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    qty          INTEGER NOT NULL CHECK (qty > 0),
    PRIMARY KEY (order_id, item_id)
);

-- A spread of statuses so all three services have something to show on first run:
--   pending    -> Order Desk "confirm"
--   confirmed  -> Pickup queue (to_pick)
--   picked     -> Packup queue (to_pack)
--   packed     -> Packup queue (ready_to_ship) and "ship"
--   shipped    -> Packup queue (shipped)
-- ORD-78470 deliberately lives in WH-SOUTH to exercise the cross-warehouse 404 path.
INSERT INTO dev_orders (id, warehouse_id, status, delivery_date, placed_at,
                        customer_name, customer_phone, address_line, city) VALUES
    ('ORD-78421', 'WH-NORTH', 'pending',    NULL,                          now() - interval '3 days', 'Sanjay T.',  '+91 98200 41231', '14, Marine Drive Apartments', 'Delhi'),
    ('ORD-78422', 'WH-NORTH', 'pending',    NULL,                          now() - interval '2 days', 'Aditi R.',    '+91 98200 41232', '7B, Lake View Residences',     'Pune'),
    ('ORD-78425', 'WH-NORTH', 'confirmed',  CURRENT_DATE + 2,              now() - interval '2 days', 'Sanjay T.',  '+91 98200 41231', '14, Marine Drive Apartments', 'Delhi'),
    ('ORD-78429', 'WH-NORTH', 'confirmed',  CURRENT_DATE + 1,              now() - interval '1 day',  'Kavya R.',    '+91 98200 41233', '22, Palm Grove',              'Mumbai'),
    ('ORD-78418', 'WH-NORTH', 'picked',     CURRENT_DATE + 1,              now() - interval '5 days', 'Rahul M.',    '+91 98200 41234', '3, Hillcrest Villa',         'Nashik'),
    ('ORD-78440', 'WH-NORTH', 'picked',     CURRENT_DATE + 3,              now() - interval '4 days', 'Neha S.',     '+91 98200 41235', '88, Riverside Flats',         'Pune'),
    ('ORD-78455', 'WH-NORTH', 'packed',     CURRENT_DATE + 4,              now() - interval '3 days', 'Imran K.',    '+91 98200 41236', '5, Sunlit Court',            'Surat'),
    ('ORD-78460', 'WH-NORTH', 'shipped',    CURRENT_DATE - 1,              now() - interval '8 days', 'Divya P.',    '+91 98200 41237', '61, Green Meadows',           'Pune'),
    ('ORD-78465', 'WH-NORTH', 'delivered',  CURRENT_DATE - 2,              now() - interval '12 days','Vikram N.',   '+91 98200 41238', '9, Harbour Point',            'Goa'),
    ('ORD-78470', 'WH-SOUTH', 'confirmed',  CURRENT_DATE + 2,              now() - interval '1 day',  'Meera J.',    '+91 98200 41239', '12, Banyan Park',             'Bengaluru');

INSERT INTO dev_order_items (order_id, item_id, sku, product_name, qty) VALUES
    ('ORD-78421', 'ITEM-1', 'S360-MOB-001', 'Shop360 Pro Smartphone', 1),
    ('ORD-78421', 'ITEM-2', 'S360-AUD-002', 'AirWave Wireless Headphones', 1),
    ('ORD-78422', 'ITEM-1', 'S360-BEA-008', 'GlowCare Face Serum', 2),
    ('ORD-78425', 'ITEM-1', 'S360-MOB-001', 'Shop360 Pro Smartphone', 1),
    ('ORD-78425', 'ITEM-2', 'S360-SHO-005', 'Urban Runner Sneakers', 1),
    ('ORD-78429', 'ITEM-1', 'S360-WAT-004', 'PulseFit Smartwatch', 1),
    ('ORD-78429', 'ITEM-2', 'S360-FAS-006', 'Linen Overshirt', 2),
    ('ORD-78418', 'ITEM-1', 'S360-SHO-005', 'Urban Runner Sneakers', 1),
    ('ORD-78440', 'ITEM-1', 'S360-HOM-007', 'BrewMaster Blender', 1),
    ('ORD-78455', 'ITEM-1', 'S360-LAP-003', 'NovaBook Laptop', 1),
    ('ORD-78460', 'ITEM-1', 'S360-MOB-001', 'Shop360 Pro Smartphone', 1),
    ('ORD-78465', 'ITEM-1', 'S360-BEA-008', 'GlowCare Face Serum', 1),
    ('ORD-78470', 'ITEM-1', 'S360-SHO-005', 'Urban Runner Sneakers', 1);

-- Stock the pick flow can draw down. Quantities are deliberately larger than the seeded
-- order lines so a pick cannot exhaust a bin during demos.
INSERT INTO inventory_rows (warehouse_id, sku, zone, bin, qty) VALUES
    ('WH-NORTH', 'S360-MOB-001', 'B', 'B-01-04', 32),
    ('WH-NORTH', 'S360-AUD-002', 'B', 'B-02-03', 25),
    ('WH-NORTH', 'S360-LAP-003', 'A', 'A-01-01', 12),
    ('WH-NORTH', 'S360-WAT-004', 'C', 'C-01-09', 18),
    ('WH-NORTH', 'S360-SHO-005', 'C', 'C-02-04', 60),
    ('WH-NORTH', 'S360-FAS-006', 'D', 'D-01-03', 20),
    ('WH-NORTH', 'S360-HOM-007', 'D', 'D-02-06', 14),
    ('WH-NORTH', 'S360-BEA-008', 'D', 'D-04-01', 40),
    ('WH-SOUTH', 'S360-SHO-005', 'A', 'A-01-01', 30)
ON CONFLICT (warehouse_id, sku, bin) DO NOTHING;
