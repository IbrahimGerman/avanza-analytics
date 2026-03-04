
require('dotenv').config();
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

        // 2. Clear existing data
        await pool.query('TRUNCATE TABLE deals, employees, transactions, accounts, customers, products, branches, regions CASCADE;');

        // 3. Insert Regions
        const regions = ['North', 'South', 'East', 'West', 'Central'];
        for (const r of regions) {
            await pool.query('INSERT INTO regions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [r]);
        }
        const regionRes = await pool.query('SELECT id, name FROM regions');
        const regionMap = {};
        regionRes.rows.forEach(r => regionMap[r.name] = r.id);

        // 4. Insert Branches
        await pool.query(`
            INSERT INTO branches (name, region_id, location) VALUES 
            ('Main HQ', ${regionMap['Central']}, 'Downtown'),
            ('North Hub', ${regionMap['North']}, 'Uptown'),
            ('South Center', ${regionMap['South']}, 'Coastal Area')
        `);
        const branchRes = await pool.query('SELECT id FROM branches LIMIT 1');
        const branchId = branchRes.rows[0].id;

        // 5. Insert Team Members (Employees)
        const team = [
            { name: 'Ahmed Khan', role: 'Senior Consultant', division: 'Sales', email: 'ahmed@avanza.corp', color: '#e11d48', avatar: 'AK' },
            { name: 'Sara Williams', role: 'Account Executive', division: 'Sales', email: 'sara@avanza.corp', color: '#be123c', avatar: 'SW' },
            { name: 'Michael Ross', role: 'Sales Director', division: 'Sales', email: 'michael@avanza.corp', color: '#9f1239', avatar: 'MR' },
            { name: 'Priya Mehta', role: 'Presales Engineer', division: 'Presales', email: 'priya@avanza.corp', color: '#e11d48', avatar: 'PM' },
            { name: 'James Carter', role: 'Business Analyst', division: 'Presales', email: 'james@avanza.corp', color: '#be123c', avatar: 'JC' },
            { name: 'Fatima Al-Hassan', role: 'Presales Consultant', division: 'Presales', email: 'fatima@avanza.corp', color: '#7c3aed', avatar: 'FA' },
            { name: 'Omar Khalid', role: 'Enterprise AE', division: 'Sales', email: 'omar@avanza.corp', color: '#0891b2', avatar: 'OK' },
            { name: 'Umer', role: 'Presales Support', division: 'Presales', email: 'umer@avanza.corp', color: '#2dd4bf', avatar: 'UM' }
        ];

        for (const m of team) {
            await pool.query(
                'INSERT INTO employees (name, role, division, branch_id, email, color, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [m.name, m.role, m.division, branchId, m.email, m.color, m.avatar]
            );
        }
        const employeeRes = await pool.query('SELECT id, name, division FROM employees');
        const employees = employeeRes.rows;

        // 6. Insert Deals (Generating ~200 deals)
        const statuses = ['Closed Won', 'Closed Lost', 'In Pipeline', 'Negotiation'];
        const dealRegions = ['North', 'South', 'East', 'West', 'Central'];

        console.log('Generating 200+ deals...');
        for (let i = 0; i < 220; i++) {
            const owner = employees[i % employees.length];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const value = 15000 + Math.random() * 85000; // 15k - 100k
            const region = dealRegions[Math.floor(Math.random() * dealRegions.length)];
            const title = `Project ${owner.name.split(' ')[0]} - ${i}`;

            // Dates within 2025 and 2026
            const is2026 = Math.random() > 0.3;
            const month = Math.floor(Math.random() * 12);
            const date = new Date(is2026 ? 2026 : 2025, month, Math.floor(Math.random() * 28) + 1);
            const closedDate = status.startsWith('Closed') ? new Date(date.getTime() + 1000 * 60 * 60 * 24 * 30) : null;

            await pool.query(
                `INSERT INTO deals (title, value, status, division, region, owner_id, created_at, closed_at, signing_value) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    title,
                    value,
                    status,
                    owner.division,
                    region,
                    owner.id,
                    date,
                    closedDate,
                    status === 'Closed Won' ? value : value * 0.4 // Mock signing value logic
                ]
            );
        }

        console.log('Seeding Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
