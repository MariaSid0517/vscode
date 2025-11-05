const express = require("express");
const router = express.Router();
const db = require("../db");

// --- Get all volunteers ---
router.get("/volunteers", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT user_id AS volunteer_id, first_name, last_name
      FROM userprofile
      ORDER BY first_name
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching volunteers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Send notification ---
router.post("/send", async (req, res) => {
  const { volunteer_id, type, message } = req.body;
  const date_sent = new Date().toISOString().split("T")[0];

  try {
    if (!type || !message || volunteer_id === undefined) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (volunteer_id == 0) {
      // Send to ALL volunteers
      const [volunteers] = await db.query(`SELECT profile_id FROM userprofile`);
      const inserts = volunteers.map(v => [v.profile_id, type, message, date_sent]);
      await db.query(
        `INSERT INTO notifications (volunteer_id, type, message, date_sent) VALUES ?`,
        [inserts]
      );
    } else {
      // Send to a single volunteer
      await db.query(
        `INSERT INTO notifications (volunteer_id, type, message, date_sent)
         VALUES (?, ?, ?, ?)`,
        [volunteer_id, type, message, date_sent]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- Get notifications for a volunteer ---
router.get("/volunteer/:id", async (req, res) => {
  const volunteer_id = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT notification_id, type, message, date_sent
      FROM notifications
      WHERE volunteer_id = ?
      ORDER BY date_sent DESC
    `, [volunteer_id]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
