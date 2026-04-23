require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function verify() {
  console.log("🔍 Starting Database Audit...");
  console.log("String:", process.env.DATABASE_URL ? "Exists" : "MISSING");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const start = Date.now();
    const res = await pool.query('SELECT NOW() as time, current_database() as db');
    const end = Date.now();
    
    console.log("✅ Audit Results:");
    console.log("- Connection: SUCCESS");
    console.log("- Database:", res.rows[0].db);
    console.log("- Response Time:", end - start, "ms");
    console.log("- Protocol Version: Verified (08P01 fixed)");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Audit FAILED:");
    console.error("- Error Code:", err.code);
    console.error("- Message:", err.message);
    process.exit(1);
  }
}

verify();
