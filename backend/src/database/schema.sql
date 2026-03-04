
-- Clean Slate for Seeding
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

DROP TABLE IF EXISTS regions CASCADE;

CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    manager VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_id INTEGER REFERENCES regions(id),
    location VARCHAR(255),
    manager_name VARCHAR(100)
);

-- Modified Employees to include Division
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50), -- 'Senior Consultant', 'Account Executive', etc.
    division VARCHAR(50), -- 'Sales', 'Presales'
    branch_id INTEGER REFERENCES branches(id),
    email VARCHAR(100) UNIQUE,
    color VARCHAR(20),
    avatar VARCHAR(10)
);

-- NEW: Deals Table for CRM Analytics
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50), -- 'Closed Won', 'Closed Lost', 'In Pipeline', 'Negotiation'
    division VARCHAR(50), -- 'Sales', 'Presales'
    region VARCHAR(50), -- 'North', 'South', 'East', 'West', 'Central'
    owner_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    signing_value DECIMAL(15, 2) -- Calculated/Projected value
);

-- Existing Banking Tables
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    segment VARCHAR(50), 
    risk_profile VARCHAR(50),
    branch_id INTEGER REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    interest_rate DECIMAL(5, 2),
    fee DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Active',
    opened_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2),
    term_months INTEGER,
    start_date DATE,
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20),
    amount DECIMAL(15, 2),
    description VARCHAR(255),
    channel VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100),
    value DECIMAL(15, 2),
    target DECIMAL(15, 2),
    unit VARCHAR(20),
    period_date DATE,
    dimension_type VARCHAR(50),
    dimension_id INTEGER
);
