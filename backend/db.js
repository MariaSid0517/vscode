// db.js
require('dotenv').config();
const mysql = require('mysql2/promise'); // use the promise version

// Create a connection pool (recommended for multi-user projects)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // ✅ Fix for self-signed SSL
  connectionLimit: 10
});

// Test the connection
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('Connected to MySQL database!');
    conn.release();
  } catch (err) {
    console.error(' Database connection failed:', err.message);
  }
})();

module.exports = db;
