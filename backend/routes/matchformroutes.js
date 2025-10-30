const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all volunteers from userprofile
router.get("/volunteers", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT profile_id AS id,
             CONCAT(first_name, ' ', last_name) AS name,
             skills
      FROM userprofile
    `);

    const volunteers = rows.map(v => ({
      id: v.id,
      name: v.name,
      skills: v.skills ? v.skills.split(",") : []
    }));

    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching volunteers from userprofile");
  }
});

// Get all events from eventdetails
router.get("/events", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT event_id AS id,
             event_name AS name,
             required_skills
      FROM eventdetails
    `);

    const events = rows.map(e => ({
      id: e.id,
      name: e.name,
      required_skills: e.required_skills ? e.required_skills.split(",") : []
    }));

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching events from eventdetails");
  }
});

// Assign volunteer to event
router.post("/assign", async (req, res) => {
  const { volunteer_id, event_id } = req.body;

  if (!volunteer_id || !event_id) {
    return res.status(400).send("Missing volunteer_id or event_id");
  }

  try {
    // Check if already assigned
    const [existing] = await db.query(
      `SELECT * FROM volunteermatches WHERE volunteer_id = ? AND event_id = ?`,
      [volunteer_id, event_id]
    );

    if (existing.length > 0) {
      return res.status(400).send("Volunteer already matched to this event.");
    }

    // Insert match
    await db.query(
      `INSERT INTO volunteermatches (volunteer_id, event_id) VALUES (?, ?)`,
      [volunteer_id, event_id]
    );

    res.send("Match saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving match");
  }
});

// Get all existing matches
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT vm.volunteer_id, vm.event_id,
             CONCAT(u.first_name, ' ', u.last_name) AS volunteer_name,
             e.event_name AS event_name
      FROM volunteermatches vm
      JOIN userprofile u ON vm.volunteer_id = u.profile_id
      JOIN eventdetails e ON vm.event_id = e.event_id
    `);

    const matches = rows.map(row => ({
      volunteer: { id: row.volunteer_id, name: row.volunteer_name },
      event: { id: row.event_id, name: row.event_name }
    }));

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching existing matches");
  }
});

module.exports = router;
