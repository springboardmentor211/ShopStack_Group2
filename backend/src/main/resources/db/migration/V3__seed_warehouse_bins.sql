-- V3__seed_warehouse_bins.sql
-- Dev/test seed only. Matches the frontend mock in
-- frontend/src/warehouse/mocks so both sides render the same bins.

INSERT INTO warehouses (id, name, city, owner_name)
VALUES ('WH-NORTH', 'North Hub', 'Pune', 'Maya Sharma')
ON CONFLICT (id) DO NOTHING;

INSERT INTO warehouses (id, name, city, owner_name)
VALUES ('WH-SOUTH', 'South Hub', 'Bengaluru', 'Karan Mehta')
ON CONFLICT (id) DO NOTHING;

INSERT INTO warehouse_bins (warehouse_id, zone, bin_label) VALUES
    ('WH-NORTH', 'A', 'A-01-01'),
    ('WH-NORTH', 'A', 'A-03-02'),
    ('WH-NORTH', 'A', 'A-05-04'),
    ('WH-NORTH', 'B', 'B-01-04'),
    ('WH-NORTH', 'B', 'B-02-03'),
    ('WH-NORTH', 'B', 'B-03-01'),
    ('WH-NORTH', 'B', 'B-07-05'),
    ('WH-NORTH', 'C', 'C-01-09'),
    ('WH-NORTH', 'C', 'C-02-04'),
    ('WH-NORTH', 'D', 'D-01-03'),
    ('WH-NORTH', 'D', 'D-02-06'),
    ('WH-NORTH', 'D', 'D-04-01')
ON CONFLICT (warehouse_id, bin_label) DO NOTHING;

INSERT INTO warehouse_bins (warehouse_id, zone, bin_label) VALUES
    ('WH-SOUTH', 'A', 'A-01-01'),
    ('WH-SOUTH', 'A', 'A-02-02'),
    ('WH-SOUTH', 'B', 'B-01-04')
ON CONFLICT (warehouse_id, bin_label) DO NOTHING;

-- Two pending ASNs so the receive flow is exercisable in dev.
INSERT INTO inbound_shipments (id, warehouse_id, vendor_id, sku, qty, status, arrived_at) VALUES
    ('ASN-2051', 'WH-NORTH', 'VND-103', 'S360-SHO-005', 60, 'pending', now() - interval '2 hours'),
    ('ASN-2052', 'WH-NORTH', 'VND-101', 'S360-MOB-001', 32, 'pending', now() - interval '1 hour')
ON CONFLICT (id) DO NOTHING;
