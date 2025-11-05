const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper: split CSV strings into clean lists
const toList = (str) =>
  (str || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);


router.get("/volunteers", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT profile_id AS id, CONCAT(first_name, ' ', last_name) AS name, skills
      FROM userprofile
    `);
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name || `Profile #${r.id}`,
        skills: toList(r.skills),
      }))
    );
  } catch (err) {
    console.error("volunteers error:", err);
    res.status(500).send("Error fetching volunteers from userprofile");
  }
});


router.get("/events", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT event_id AS id, event_name AS name, required_skills
      FROM eventdetails
    `);
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name || `Event #${r.id}`,
        required_skills: toList(r.required_skills),
      }))
    );
  } catch (err) {
    console.error("events error:", err);
    res.status(500).send("Error fetching events from eventdetails");
  }
});


router.post("/assign", async (req, res) => {
  const { volunteer_id, event_id } = req.body || {};
  if (!volunteer_id || !event_id)
    return res.status(400).send("Missing volunteer_id or event_id");

  try {
    const [[profile]] = await db.query(
      "SELECT user_id FROM userprofile WHERE profile_id = ?",
      [volunteer_id]
    );
    if (!profile) return res.status(404).send("Volunteer profile not found.");

    const user_id = profile.user_id;

    await db.query(
      `INSERT INTO volunteermatches (user_id, volunteer_id, event_id, status)
       VALUES (?, ?, ?, 'upcoming')`,
      [user_id, volunteer_id, event_id]
    );

    res.send("Match saved successfully!");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).send("Volunteer already matched to this event.");
    }
    console.error("assign error:", err);
    res.status(500).send("Error saving match");
  }
});


router.get("/list", async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT vm.volunteer_id, vm.event_id,
             CONCAT(up.first_name, ' ', up.last_name) AS volunteer_name,
             e.event_name AS event_name, vm.status
      FROM volunteermatches vm
      JOIN userprofile up ON up.profile_id = vm.volunteer_id
      JOIN eventdetails e ON e.event_id = vm.event_id
      ORDER BY vm.created_at DESC
    `);
    res.json(
      rows.map((r) => ({
        volunteer: { id: r.volunteer_id, name: r.volunteer_name },
        event: { id: r.event_id, name: r.event_name },
        status: r.status,
      }))
    );
  } catch (err) {
    console.error("list error:", err);
    res.status(500).send("Error fetching existing matches");
  }
});


router.get("/my", async (req, res) => {
  const userId = parseInt(req.query.user_id, 10);
  if (!userId) return res.status(400).send("Missing user_id");

  try {
    const [rows] = await db.query(
      `
      SELECT e.event_id, e.event_name, e.event_description, e.event_date, 
             e.location, vm.created_at, vm.status
      FROM volunteermatches vm
      JOIN eventdetails e ON e.event_id = vm.event_id
      WHERE vm.user_id = ? AND vm.status = 'upcoming'
      ORDER BY vm.created_at DESC
    `,
      [userId]
    );

    res.json(
      rows.map((r) => ({
        event: {
          id: r.event_id,
          name: r.event_name,
          description: r.event_description,
          date: r.event_date,
          location: r.location,
        },
        matched_at: r.created_at,
        status: r.status,
      }))
    );
  } catch (err) {
    console.error("my error:", err);
    res.status(500).send("Error fetching user matches");
  }
});


router.post("/complete", async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "Missing user_id or event_id" });
  }

  try {
    const [result] = await db.query(
      `UPDATE volunteermatches 
       SET status = 'completed'
       WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No match found to update." });
    }

    res.json({ message: "Event marked as completed!" });
  } catch (err) {
    console.error("complete error:", err);
    res.status(500).json({ error: "Failed to update event status." });
  }
});


router.get("/completed", async (req, res) => {
  const userId = parseInt(req.query.user_id, 10);
  if (!userId) return res.status(400).send("Missing user_id");

  try {
    const [rows] = await db.query(
      `
      SELECT e.event_name, e.event_description, e.location, 
             e.required_skills, e.urgency, e.event_date, vm.status
      FROM volunteermatches vm
      JOIN eventdetails e ON e.event_id = vm.event_id
      WHERE vm.user_id = ? AND vm.status = 'completed'
      ORDER BY e.event_date DESC
    `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("completed error:", err);
    res.status(500).send("Error fetching completed events");
  }
});

router.get("/history", async (req, res) => {
  try {
    const sql = `
      SELECT 
        CONCAT(up.first_name, ' ', up.last_name) AS volunteer_name,
        ed.event_name,
        ed.event_date,
        ed.location,
        ed.required_skills,
        ed.urgency,
        vm.status
      FROM volunteermatches vm
      JOIN userprofile up ON vm.volunteer_id = up.profile_id
      JOIN eventdetails ed ON vm.event_id = ed.event_id
      ORDER BY ed.event_date DESC;
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error retrieving volunteer history:", err);
    res.status(500).json({ error: "Failed to load volunteer history" });
  }
});


module.exports = router;
