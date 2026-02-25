
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:78640@localhost:5432/avanza_ai_db',
});

module.exports = { pool };
