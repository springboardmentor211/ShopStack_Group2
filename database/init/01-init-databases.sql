-- ShopSphere Microservices Databases Initialization Script

CREATE DATABASE shopsphere_auth;
CREATE DATABASE shopsphere_user;
CREATE DATABASE shopsphere_product;
CREATE DATABASE shopsphere_inventory;
CREATE DATABASE shopsphere_order;
CREATE DATABASE shopsphere_payment;
CREATE DATABASE shopsphere_warehouse;
CREATE DATABASE shopsphere_shipping;
CREATE DATABASE shopsphere_coupon;
CREATE DATABASE shopsphere_notification;
CREATE DATABASE shopsphere_analytics;

-- Connect to auth database and create schema
\c shopsphere_auth;

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);