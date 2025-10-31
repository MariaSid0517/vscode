// backend/routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /profiles/:user_id
router.get("/profiles/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM userprofile WHERE user_id = ?", [user_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// PUT /profiles/:user_id
router.put("/profiles/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { name, address1, address2, city, state, zip, preferences, skills } = req.body;

  const [first_name, ...rest] = name.split(" ");
  const last_name = rest.join(" ");
  const address = `${address1} ${address2 || ""}`.trim();
  const skillsStr = Array.isArray(skills) ? skills.join(",") : "";

  try {
    const [existing] = await db.query("SELECT * FROM userprofile WHERE user_id = ?", [user_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE userprofile 
         SET first_name=?, last_name=?, address=?, city=?, state_id=?, zipcode=?, preferences=?, skills=?
         WHERE user_id=?`,
        [first_name, last_name, address, city, state, zip, preferences, skillsStr, user_id]
      );
    } else {
      await db.query(
        `INSERT INTO userprofile 
         (user_id, first_name, last_name, address, city, state_id, zipcode, preferences, skills)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, first_name, last_name, address, city, state, zip, preferences, skillsStr]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ error: "Profile update failed", detail: err.message });
  }
});

module.exports = router;
