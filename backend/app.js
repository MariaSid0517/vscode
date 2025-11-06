// Load environment variables and dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const stateRoutes = require('./routes/stateRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const matchRoutes = require('./routes/matchformroutes'); // volunteer matching routes
const notificationRoutes = require('./routes/notificationRoutes');


// Initialize app
const app = express();

// Allow requests from Live Server (5500) and local backends (3000)
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',   // VS Code Live Server
    'http://localhost:5500',   // alternate
    'http://127.0.0.1:3000',   // same host (self)
    'http://localhost:3000'    // same host (self)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Optional: log requests for debugging
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Health check
app.get('/', (_req, res) => {
  res.send('Server is running and connected to Azure MySQL.');
});

// DB test
app.get('/test-db', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS server_time;');
    res.json({ connected: true, server_time: rows[0].server_time });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Register routes
app.use('/events', eventRoutes);
app.use('/states', stateRoutes);
app.use('/', authRoutes);        // /register, /login
app.use('/', profileRoutes);     // /profiles/:user_id
app.use('/match', matchRoutes);  // volunteer matching
app.use('/notifications', notificationRoutes);


// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server on 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
