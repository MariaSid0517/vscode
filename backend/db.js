const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin','volunteer')) NOT NULL
  )
`);

module.exports = db;
