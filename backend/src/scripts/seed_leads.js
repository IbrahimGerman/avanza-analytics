const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Adjust path to .env if needed

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const CSV_FILE_PATH = path.join(__dirname, '../../../data/leads.csv');

async function seedLeads() {
    let client;
    try {
        console.log('Connecting to database...');
        client = await pool.connect();

        console.log('Dropping existing leads table...');
        await client.query('DROP TABLE IF EXISTS leads');

        console.log('Creating leads table...');
        await client.query(`
            CREATE TABLE leads (
                lead_id INTEGER PRIMARY KEY,
                resource_name VARCHAR(255),
                branch_name VARCHAR(255),
                city VARCHAR(100),
                region VARCHAR(100),
                category VARCHAR(50),
                status VARCHAR(50),
                revenue NUMERIC,
                signing_value NUMERIC,
                unit VARCHAR(50),
                quarter VARCHAR(10),
                year INTEGER
            );
        `);

        console.log(`Reading CSV file from ${CSV_FILE_PATH}...`);
        const data = fs.readFileSync(CSV_FILE_PATH, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');

        // Skip header
        const header = lines.shift(); 
        console.log('Header:', header);

        console.log(`Inserting ${lines.length} records...`);
        
        const insertQuery = `
            INSERT INTO leads (
                lead_id, resource_name, branch_name, city, region, category, 
                status, revenue, signing_value, unit, quarter, year
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        for (const line of lines) {
            // Simple CSV parsing (assuming no commas in values based on file inspection)
            const cols = line.split(',').map(c => c.trim());
            
            if (cols.length < 12) {
                console.warn('Skipping invalid line:', line);
                continue;
            }

            await client.query(insertQuery, [
                parseInt(cols[0]), // lead_id
                cols[1], // resource_name
                cols[2], // branch_name
                cols[3], // city
                cols[4], // region
                cols[5], // category
                cols[6], // status
                parseFloat(cols[7]), // revenue
                parseFloat(cols[8]), // signing_value
                cols[9],  // unit
                cols[10], // quarter
                parseInt(cols[11]) // year
            ]);
        }

        console.log('Seeding completed successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

seedLeads();
