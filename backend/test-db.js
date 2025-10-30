require('dotenv').config();
const db = require('./db');

(async () => {
  try {
    console.log(' Testing database connection...');

    // Simple query to confirm connection
    const [rows] = await db.query('SHOW TABLES;');
    console.log(' Connection successful!');
    console.log(' Tables in database:', rows);
  } catch (err) {
    console.error(' Database connection failed:', err.message);
  } finally {
    db.end();
  }
})();
