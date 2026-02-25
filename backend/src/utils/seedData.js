
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
    try {
        console.log('Starting Data Seeding...');

        // 1. Run Schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log('Schema created.');

        // 2. Clear existing data (optional, for idempotency)
        // await pool.query('TRUNCATE TABLE kpis, transactions, loans, accounts, customers, employees, branches, regions, products RESTART IDENTITY CASCADE;');

        // 3. Insert Regions
        const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
        for (const r of regions) {
            await pool.query('INSERT INTO regions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [r]);
        }

        // 4. Insert Branches (Mock)
        // Fetch region IDs first
        const regionRes = await pool.query('SELECT id, name FROM regions');
        const regionMap = {};
        regionRes.rows.forEach(r => regionMap[r.name] = r.id);

        await pool.query(`
            INSERT INTO branches (name, region_id, location, manager_name) VALUES 
            ('New York HQ', ${regionMap['North America']}, '123 Wall St', 'John Doe'),
            ('London Branch', ${regionMap['Europe']}, '456 Oxford St', 'Jane Smith'),
            ('Singapore Hub', ${regionMap['Asia Pacific']}, '789 Marina Bay', 'Wei Chen')
            ON CONFLICT DO NOTHING;
        `);

        // 5. Insert Products
        await pool.query(`
            INSERT INTO products (name, category, interest_rate, fee) VALUES 
            ('Premium Earner', 'Savings', 4.5, 0),
            ('Growth Fund', 'Investment', 7.0, 1.5),
            ('Home Loan', 'Loan', 5.5, 500)
            ON CONFLICT DO NOTHING;
        `);

        // 6. Insert Mock Customers & Accounts (Loop)
        // Generate 50 mock customers
        for (let i = 0; i < 50; i++) {
            const name = `Customer ${i + 1}`;
            const email = `customer${i + 1}@example.com`;
            // Insert Customer
            const custRes = await pool.query(
                'INSERT INTO customers (name, email, segment, branch_id) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING id',
                [name, email, i % 2 === 0 ? 'Corporate' : 'Retail', 1] // Assign to NY branch for simplicity
            );

            if (custRes.rows.length > 0) {
                const custId = custRes.rows[0].id;
                // Create Account
                await pool.query(
                    'INSERT INTO accounts (account_number, customer_id, product_id, balance) VALUES ($1, $2, $3, $4)',
                    [`ACCT-${1000 + i}`, custId, 1, Math.random() * 100000]
                );
                // Create Transactions
                for (let j = 0; j < 5; j++) {
                    await pool.query(
                        'INSERT INTO transactions (account_id, type, amount, description) VALUES ((SELECT id FROM accounts WHERE account_number=$1), $2, $3, $4)',
                        [`ACCT-${1000 + i}`, j % 2 === 0 ? 'Deposit' : 'Withdrawal', Math.random() * 1000, 'ATM Transaction']
                    );
                }
            }
        }

        console.log('Seeding Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
