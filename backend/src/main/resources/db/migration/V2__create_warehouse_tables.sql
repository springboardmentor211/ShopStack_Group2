-- V2__create_warehouse_tables.sql

CREATE TABLE warehouses (
    id            VARCHAR(20)  PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    city          VARCHAR(100),
    owner_name    VARCHAR(100)
);

CREATE TABLE warehouse_bins (
    id            BIGSERIAL    PRIMARY KEY,
    warehouse_id  VARCHAR(20)  NOT NULL REFERENCES warehouses(id),
    zone          VARCHAR(10)  NOT NULL,
    bin_label     VARCHAR(20)  NOT NULL,
    UNIQUE (warehouse_id, bin_label)
);

CREATE TABLE inbound_shipments (
    id            VARCHAR(20)  PRIMARY KEY,
    warehouse_id  VARCHAR(20)  NOT NULL REFERENCES warehouses(id),
    vendor_id     VARCHAR(20)  NOT NULL,
    sku           VARCHAR(30)  NOT NULL,
    qty           INTEGER      NOT NULL CHECK (qty > 0),
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending',
    bin           VARCHAR(20),
    arrived_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    received_at   TIMESTAMPTZ,
    version       INTEGER      NOT NULL DEFAULT 0
);

CREATE TABLE inventory_rows (
    id            BIGSERIAL    PRIMARY KEY,
    warehouse_id  VARCHAR(20)  NOT NULL REFERENCES warehouses(id),
    sku           VARCHAR(30)  NOT NULL,
    zone          VARCHAR(10)  NOT NULL,
    bin           VARCHAR(20)  NOT NULL,
    qty           INTEGER      NOT NULL DEFAULT 0 CHECK (qty >= 0),
    UNIQUE (warehouse_id, sku, bin)
);

CREATE TABLE stock_movements (
    id            VARCHAR(20)  PRIMARY KEY,
    warehouse_id  VARCHAR(20)  NOT NULL REFERENCES warehouses(id),
    sku           VARCHAR(30)  NOT NULL,
    type          VARCHAR(30)  NOT NULL,
    from_loc      VARCHAR(100),
    to_loc        VARCHAR(100),
    qty           INTEGER      NOT NULL,
    performed_by  VARCHAR(100),
    at            TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE SEQUENCE mov_seq START 5001;