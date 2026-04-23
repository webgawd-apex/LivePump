require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDb() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');

  try {
    console.log('Initializing database schema...');
    await pool.query(schema);
    console.log('Schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing schema:', err);
  } finally {
    await pool.end();
  }
}

initDb();
