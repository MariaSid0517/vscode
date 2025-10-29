const express = require('express');
const router = express.Router();
const db = require('../db');

//  Get all states
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT state_id, state_code, state_name FROM states ORDER BY state_name;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching states:', err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

module.exports = router;
