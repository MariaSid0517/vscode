const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT profile_id, CONCAT(first_name, ' ', last_name) AS name FROM userprofile"
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch volunteers:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Send a notification
router.post("/send", async (req, res) => {
  const { volunteer_id, type, message } = req.body;

  if (!type || !message || volunteer_id === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const date_sent = new Date().toISOString().split("T")[0];

  try {
    if (volunteer_id === 0) {
      // Send to all volunteers
      await db.query(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) " +
        "SELECT profile_id, ?, ?, ? FROM userprofile",
        [type, message, date_sent]
      );
    } else {
      // Send to a specific volunteer
      await db.query(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) VALUES (?, ?, ?, ?)",
        [volunteer_id, type, message, date_sent]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

module.exports = router;
