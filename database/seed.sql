-- Seed Data

-- Regions
INSERT INTO regions (name, manager_name) VALUES
('North', 'John Doe'),
('South', 'Jane Smith'),
('East', 'Alice Johnson'),
('West', 'Bob Wilson');

-- Products
INSERT INTO products (name, category, interest_rate) VALUES
('Basic Checking', 'Checking', 0.0000),
('Premium Savnings', 'Savings', 0.0450),
('Mortgage Loan', 'Loan', 0.0650),
('Auto Loan', 'Loan', 0.0700),
('Investment Fund A', 'Investment', 0.0800);

-- Branches (Sample)
INSERT INTO branches (name, region_id, city, state) VALUES
('Downtown Branch', 1, 'New York', 'NY'),
('Suburban Branch', 1, 'White Plains', 'NY'),
('Miami Main', 2, 'Miami', 'FL'),
('Atlanta Hub', 2, 'Atlanta', 'GA'),
('Boston Commons', 3, 'Boston', 'MA'),
('Philly Center', 3, 'Philadelphia', 'PA'),
('LA Plaza', 4, 'Los Angeles', 'CA'),
('SF Bay', 4, 'San Francisco', 'CA');

-- Dates (Simple generation for last 2 years - manual simplistic fill for seed)
INSERT INTO dates (date_key, year, quarter, month, week, day_of_week)
SELECT 
    d::date, 
    EXTRACT(YEAR FROM d),
    EXTRACT(QUARTER FROM d),
    EXTRACT(MONTH FROM d),
    EXTRACT(WEEK FROM d),
    EXTRACT(DOW FROM d)
FROM generate_series('2023-01-01'::date, '2024-12-31'::date, '1 day'::interval) d;

-- Customers (5 Mock)
INSERT INTO customers (first_name, last_name, email, segment, home_branch_id) VALUES
('Michael', 'Scott', 'm.scott@example.com', 'VIP', 1),
('Dwight', 'Schrute', 'd.schrute@example.com', 'Premium', 1),
('Jim', 'Halpert', 'j.halpert@example.com', 'Standard', 2),
('Pam', 'Beesly', 'p.beesly@example.com', 'Standard', 3),
('Stanley', 'Hudson', 's.hudson@example.com', 'Standard', 4);

-- Accounts
INSERT INTO accounts (customer_id, product_id, branch_id, balance, open_date) VALUES
(1, 1, 1, 5000.00, '2023-01-15'),
(1, 2, 1, 25000.00, '2023-02-01'),
(2, 5, 1, 150000.00, '2023-03-10'),
(3, 1, 2, 1500.00, '2023-01-20'),
(4, 3, 3, -250000.00, '2023-05-05'); -- Mortgage balance

-- Transactions (Sample)
INSERT INTO transactions (account_id, amount, transaction_type, channel) VALUES
(1, 1000.00, 'Deposit', 'ATM'),
(1, -50.00, 'Withdrawal', 'ATM'),
(2, 500.00, 'Interest', 'System'),
(3, -2000.00, 'Transfer', 'Online'),
(4, 5000.00, 'Deposit', 'Branch');
