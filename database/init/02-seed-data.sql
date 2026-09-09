-- ShopSphere Seed Data

\c shopsphere_auth;

INSERT INTO roles (name) VALUES 
('ROLE_CUSTOMER'),
('ROLE_VENDOR'),
('ROLE_ADMIN'),
('ROLE_WAREHOUSE_STAFF')
ON CONFLICT (name) DO NOTHING;
