// Load environment variables and dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const stateRoutes = require('./routes/stateRoutes'); //New states route
const matchRoutes = require("./routes/matchformroutes");
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Server is running and connected to Azure MySQL.');
});

// Quick DB test
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS server_time;');
    res.json({ connected: true, server_time: rows[0].server_time });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Register routes
app.use('/events', eventRoutes);   // Event CRUD endpoints
app.use('/states', stateRoutes);   //  New States API
app.use("/match", matchRoutes); // Routes prefixed with /match
app.use('/notifications', notificationRoutes);

// Optional user test route
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usercredentials;');
    res.json(rows);
  } catch (err) {
    console.error('User fetch failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001; // changed default port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
