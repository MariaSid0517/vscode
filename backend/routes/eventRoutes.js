const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateEvent } = require('../Admin/event');

//  POST: Create new event
router.post('/', async (req, res) => {
  const event = req.body;
  console.log("Incoming event data:", event);

  const errors = validateEvent(event);
  if (errors.length > 0) {
    console.log("Validation errors:", errors);
    return res.status(400).json({ errors });
  }

  try {
    // Insert the event into the database
    const [result] = await db.query(
      `INSERT INTO eventdetails 
      (event_name, event_description, event_date, location, state_id, max_volunteers, required_skills, urgency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        event.name,
        event.description,
        event.date,
        event.location,
        event.state_id || null,
        event.max_volunteers || null,
        event.required_skills || null,
        event.urgency || null
      ]
    );

    console.log("Event inserted, ID:", result.insertId);

    // Send a notification to all volunteers about this new event
    await db.query(`
      INSERT INTO notifications (volunteer_id, type, message, date_sent)
      SELECT profile_id, 'New Event', CONCAT('A new event "', ?, '" has been added!'), CURDATE()
      FROM userprofile
    `, [event.name]);

    res.status(201).json({
      message: 'Event created successfully and notifications sent.',
      event_id: result.insertId
    });
  } catch (err) {
    console.error('Error inserting event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET: Fetch all events (including state name)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.event_id, e.event_name, e.event_description, e.event_date, 
             e.location, s.state_name, e.max_volunteers, 
             e.required_skills, e.urgency
      FROM eventdetails e
      LEFT JOIN states s ON e.state_id = s.state_id
      ORDER BY e.event_date DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
