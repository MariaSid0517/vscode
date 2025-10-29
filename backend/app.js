//  Load environment variables and dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

//Import routes
const eventRoutes = require('./routes/eventRoutes');
const stateRoutes = require('./routes/stateRoutes'); //New states route

// Initialize the app
const app = express();

// Middleware setup
app.use(cors());              // Allow frontend (Live Server) to access backend
app.use(express.json());      // Parse JSON request bodies

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running and connected to Azure MySQL ');
});

// Register routes
app.use('/events', eventRoutes);   // Event CRUD endpoints
app.use('/states', stateRoutes);   //  New States API

// Optional: Example route to fetch users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usercredentials;');
    res.json(rows);
  } catch (err) {
    console.error(' User fetch failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
