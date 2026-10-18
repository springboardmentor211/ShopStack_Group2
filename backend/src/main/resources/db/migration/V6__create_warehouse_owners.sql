INSERT INTO warehouses (id, name, city, owner_name) VALUES
    ('WH-EAST', 'East Hub', 'Kolkata', 'Ananya Bose'),
    ('WH-WEST', 'West Hub', 'Ahmedabad', 'Imran Patel')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS warehouse_owners (
    id             BIGSERIAL    PRIMARY KEY,
    warehouse_id   VARCHAR(20)  NOT NULL REFERENCES warehouses(id),
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(100) NOT NULL,
    role           VARCHAR(30)  NOT NULL DEFAULT 'WAREHOUSE_STAFF'
);

INSERT INTO warehouse_owners (warehouse_id, name, email, password_hash, role) VALUES
    ('WH-NORTH', 'Maya Sharma',  'north@shopstack.com', '$2a$10$fLLdYn//mbIZpLL6mqajdOZaX9Z96U1PRCjzroPGI1so7ROAxsG1e', 'WAREHOUSE_STAFF'),
    ('WH-SOUTH', 'Karan Mehta',  'south@shopstack.com', '$2a$10$fLLdYn//mbIZpLL6mqajdOZaX9Z96U1PRCjzroPGI1so7ROAxsG1e', 'WAREHOUSE_STAFF'),
    ('WH-EAST',  'Ananya Bose',  'east@shopstack.com',  '$2a$10$fLLdYn//mbIZpLL6mqajdOZaX9Z96U1PRCjzroPGI1so7ROAxsG1e', 'WAREHOUSE_STAFF'),
    ('WH-WEST',  'Imran Patel',  'west@shopstack.com',  '$2a$10$fLLdYn//mbIZpLL6mqajdOZaX9Z96U1PRCjzroPGI1so7ROAxsG1e', 'WAREHOUSE_STAFF')
ON CONFLICT (email) DO NOTHING;