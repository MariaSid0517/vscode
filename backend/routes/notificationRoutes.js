const express = require('express');
const router = express.Router();
const db = require('../db');

// --- Get all volunteers ---
router.get('/volunteers', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT profile_id, first_name, last_name FROM userprofile ORDER BY first_name"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching volunteers:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Send notification ---
router.post('/send', async (req, res) => {
  let { volunteer_id, type, message } = req.body;

  // Convert string to number
  volunteer_id = parseInt(volunteer_id);

  if (!type || !message || isNaN(volunteer_id)) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const date_sent = new Date().toISOString().split("T")[0];

    if (volunteer_id === 0) {
      // Send to all volunteers
      await db.query(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) " +
        "SELECT profile_id, ?, ?, ? FROM userprofile",
        [type, message, date_sent]
      );
    } else {
      // Send to a single volunteer
      await db.query(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) VALUES (?, ?, ?, ?)",
        [volunteer_id, type, message, date_sent]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
