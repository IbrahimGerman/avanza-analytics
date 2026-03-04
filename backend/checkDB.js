
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const check = async () => {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("Tables in database:", res.rows.map(r => r.table_name));
        const count = await pool.query("SELECT COUNT(*) FROM deals");
        console.log("Deal count:", count.rows[0].count);
    } catch (err) {
        console.error("DB Check Error:", err.message);
    }
    process.exit(0);
};

check();
