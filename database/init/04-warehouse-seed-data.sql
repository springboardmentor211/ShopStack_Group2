\c shopsphere_warehouse;

INSERT INTO warehouses (code, name, address_line, city, region, country_code, postal_code)
VALUES ('NORTH-HUB', 'North Hub', 'Warehouse District, Sector 18', 'Mumbai', 'Maharashtra', 'IN', '400001')
ON CONFLICT (code) DO NOTHING;

INSERT INTO warehouse_bins (warehouse_id, code, zone, bin_type)
SELECT warehouse.id, bin.code, bin.zone, 'STORAGE'
FROM warehouses AS warehouse
CROSS JOIN (VALUES
    ('B-01-04', 'B'),
    ('A-03-12', 'A'),
    ('C-02-07', 'C'),
    ('C-02-09', 'C'),
    ('D-04-02', 'D')
) AS bin(code, zone)
WHERE warehouse.code = 'NORTH-HUB'
ON CONFLICT (warehouse_id, code) DO NOTHING;

INSERT INTO warehouse_inventory (warehouse_id, bin_id, sku, product_name, on_hand_qty, reorder_level)
SELECT warehouse.id, bin.id, stock.sku, stock.product_name, stock.on_hand_qty, stock.reorder_level
FROM warehouses AS warehouse
JOIN (VALUES
    ('B-01-04', 'S360-MOB-001', 'Shop360 Pro Smartphone', 32, 5),
    ('A-03-12', 'S360-ACC-016', 'Studio Wireless Headphones', 18, 4),
    ('C-02-07', 'S360-WEA-044', 'Everyday Runner', 12, 3),
    ('C-02-09', 'S360-ACC-102', 'Active Smartwatch', 7, 2),
    ('D-04-02', 'S360-HOM-078', 'Arc Table Lamp', 6, 2)
) AS stock(bin_code, sku, product_name, on_hand_qty, reorder_level) ON TRUE
JOIN warehouse_bins AS bin ON bin.warehouse_id = warehouse.id AND bin.code = stock.bin_code
WHERE warehouse.code = 'NORTH-HUB'
ON CONFLICT (warehouse_id, bin_id, sku) DO NOTHING;

INSERT INTO warehouse_order_fulfillments (
    external_order_id, order_number, warehouse_id, customer_id, customer_name,
    delivery_address, delivery_city, delivery_phone, placed_at, delivery_date,
    payment_status, status
)
SELECT
    '78421000-0000-4000-8000-000000000001'::UUID,
    'S360-ORD-78421',
    warehouse.id,
    '10000000-0000-4000-8000-000000000001'::UUID,
    'Priya Shah',
    '14 Marine Drive Apartments',
    'Mumbai',
    '+91 98200 41231',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_DATE + 3,
    'VERIFIED',
    'PENDING'
FROM warehouses AS warehouse
WHERE warehouse.code = 'NORTH-HUB'
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO warehouse_order_items (
    fulfillment_id, external_order_item_id, warehouse_id, bin_id, vendor_id,
    vendor_name, sku, product_name, variant, quantity
)
SELECT
    fulfillment.id,
    '78421001-0000-4000-8000-000000000001'::UUID,
    warehouse.id,
    bin.id,
    '20000000-0000-4000-8000-000000000001'::UUID,
    'Nova Electronics',
    'S360-MOB-001',
    'Shop360 Pro Smartphone',
    'Midnight black · 256 GB',
    1
FROM warehouse_order_fulfillments AS fulfillment
JOIN warehouses AS warehouse ON warehouse.id = fulfillment.warehouse_id
JOIN warehouse_bins AS bin ON bin.warehouse_id = warehouse.id AND bin.code = 'B-01-04'
WHERE fulfillment.order_number = 'S360-ORD-78421'
ON CONFLICT DO NOTHING;