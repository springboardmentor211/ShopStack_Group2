\c shopsphere_warehouse;

CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(40) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    address_line VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(100),
    country_code CHAR(2) NOT NULL DEFAULT 'IN',
    postal_code VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouse_bins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    code VARCHAR(40) NOT NULL,
    zone VARCHAR(40),
    bin_type VARCHAR(30) NOT NULL DEFAULT 'STORAGE'
        CHECK (bin_type IN ('STORAGE', 'RECEIVING', 'PACKING', 'DISPATCH', 'RETURNS')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (warehouse_id, code),
    UNIQUE (warehouse_id, id)
);

CREATE TABLE IF NOT EXISTS warehouse_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    bin_id UUID NOT NULL,
    sku VARCHAR(80) NOT NULL,
    product_id UUID,
    product_name VARCHAR(200) NOT NULL,
    on_hand_qty INTEGER NOT NULL DEFAULT 0 CHECK (on_hand_qty >= 0),
    reserved_qty INTEGER NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_bin FOREIGN KEY (warehouse_id, bin_id)
        REFERENCES warehouse_bins(warehouse_id, id),
    CONSTRAINT chk_inventory_reserved CHECK (reserved_qty <= on_hand_qty),
    UNIQUE (warehouse_id, bin_id, sku)
);

CREATE TABLE IF NOT EXISTS warehouse_order_fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_order_id UUID NOT NULL UNIQUE,
    order_number VARCHAR(60) NOT NULL UNIQUE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    customer_id UUID NOT NULL,
    customer_name VARCHAR(160) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_phone VARCHAR(40),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATE,
    payment_status VARCHAR(24) NOT NULL DEFAULT 'PENDING'
        CHECK (payment_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED')),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'CONFIRMED', 'PICKED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouse_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fulfillment_id UUID NOT NULL REFERENCES warehouse_order_fulfillments(id) ON DELETE CASCADE,
    external_order_item_id UUID,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    bin_id UUID,
    product_id UUID,
    vendor_id UUID,
    vendor_name VARCHAR(160),
    sku VARCHAR(80) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    variant VARCHAR(160),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PICKED', 'PACKED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_item_bin FOREIGN KEY (warehouse_id, bin_id)
        REFERENCES warehouse_bins(warehouse_id, id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    sku VARCHAR(80) NOT NULL,
    movement_type VARCHAR(24) NOT NULL
        CHECK (movement_type IN ('RECEIPT', 'RESERVATION', 'RELEASE', 'PICK', 'PACK', 'DISPATCH', 'ADJUSTMENT', 'TRANSFER')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    from_bin_id UUID,
    to_bin_id UUID,
    external_reference VARCHAR(100),
    performed_by UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movement_from_bin FOREIGN KEY (warehouse_id, from_bin_id)
        REFERENCES warehouse_bins(warehouse_id, id),
    CONSTRAINT fk_movement_to_bin FOREIGN KEY (warehouse_id, to_bin_id)
        REFERENCES warehouse_bins(warehouse_id, id),
    CONSTRAINT chk_movement_bin CHECK (from_bin_id IS NOT NULL OR to_bin_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS vendor_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    vendor_id UUID NOT NULL,
    vendor_name VARCHAR(160) NOT NULL,
    vendor_reference VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'EXPECTED'
        CHECK (status IN ('EXPECTED', 'RECEIVING', 'RECEIVED', 'CANCELLED')),
    expected_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    received_by UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_receipt_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_id UUID NOT NULL REFERENCES vendor_receipts(id) ON DELETE CASCADE,
    sku VARCHAR(80) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    expected_qty INTEGER NOT NULL DEFAULT 0 CHECK (expected_qty >= 0),
    received_qty INTEGER NOT NULL DEFAULT 0 CHECK (received_qty >= 0),
    bin_id UUID REFERENCES warehouse_bins(id),
    note TEXT
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_status_placed
    ON warehouse_order_fulfillments (status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_fulfillment_warehouse_date
    ON warehouse_order_fulfillments (warehouse_id, delivery_date);
CREATE INDEX IF NOT EXISTS idx_order_items_fulfillment
    ON warehouse_order_items (fulfillment_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku
    ON warehouse_inventory (sku);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse_created
    ON stock_movements (warehouse_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_receipts_status
    ON vendor_receipts (status, expected_at);