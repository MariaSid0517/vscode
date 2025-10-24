require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Server is running and connected to Azure MySQL ✅');
});

// Example route: fetch all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM UserCredentials;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
