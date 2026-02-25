
-- DROP TABLE IF EXISTS kpis CASCADE;
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS loans CASCADE;
-- DROP TABLE IF EXISTS accounts CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS employees CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS branches CASCADE;
-- DROP TABLE IF EXISTS regions CASCADE;

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

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50), -- 'Manager', 'Teller', 'Loan Officer', 'Relationship Manager'
    branch_id INTEGER REFERENCES branches(id),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    segment VARCHAR(50), -- 'Retail', 'Corporate', 'SME', 'HNI'
    risk_profile VARCHAR(50), -- 'Low', 'Medium', 'High'
    branch_id INTEGER REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'Savings', 'Loan', 'Investment', 'Card'
    interest_rate DECIMAL(5, 2),
    fee DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Dormant', 'Closed'
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
    status VARCHAR(20) -- 'Active', 'Paid', 'Defaulted'
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20), -- 'Deposit', 'Withdrawal', 'Transfer', 'Payment'
    amount DECIMAL(15, 2),
    description VARCHAR(255),
    channel VARCHAR(50) -- 'Mobile', 'Web', 'ATM', 'Branch'
);

CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100),
    value DECIMAL(15, 2),
    target DECIMAL(15, 2),
    unit VARCHAR(20),
    period_date DATE,
    dimension_type VARCHAR(50), -- 'Region', 'Branch', 'Overall'
    dimension_id INTEGER
);
