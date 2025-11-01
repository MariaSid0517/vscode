const express = require("express");
const router = express.Router();
const db = require("../db");


router.post("/notifications", async (req, res) => {
  const { volunteer_id, type, message } = req.body;

  if (!volunteer_id || !type || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.query(
      `INSERT INTO notifications (volunteer_id, type, message, date_sent)
       VALUES (?, ?, ?, CURDATE())`,
      [volunteer_id, type, message]
    );
    res.status(201).json({ message: "Notification created successfully" });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
});


router.get("/notifications/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Find volunteer profile for this user
    const [[profile]] = await db.query(
      `SELECT profile_id FROM userprofile WHERE user_id = ?`,
      [user_id]
    );

    if (!profile) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // Fetch notifications linked to that volunteer profile
    const [rows] = await db.query(
      `SELECT type, message, date_sent
       FROM notifications
       WHERE volunteer_id = ?
       ORDER BY date_sent DESC`,
      [profile.profile_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


router.get("/notifications/view/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Find the volunteer profile linked to this user_id
    const [[profile]] = await db.query(
      `SELECT profile_id FROM userprofile WHERE user_id = ?`,
      [user_id]
    );

    if (!profile) {
      return res.status(404).send("<h3>User profile not found.</h3>");
    }

    // Fetch notifications for this volunteer
    const [rows] = await db.query(
      `SELECT type, message, date_sent
       FROM notifications
       WHERE volunteer_id = ?
       ORDER BY date_sent DESC`,
      [profile.profile_id]
    );

    // Build HTML response
    let html = `
      <html>
      <head>
        <title>My Notifications</title>
        <link rel="stylesheet" href="/frontend/Volunteer/Notification/Notifications.css">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f8fc;
          }
          .container {
            width: 80%;
            margin: 40px auto;
            background: white;
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
          }
          h1 {
            text-align: center;
            color: #003366;
          }
          .notifications-list {
            list-style-type: none;
            padding: 0;
          }
          .notifications-list li {
            background: #eaf7ff;
            border-left: 5px solid #008cba;
            margin: 10px 0;
            padding: 10px 15px;
            border-radius: 5px;
          }
          .notifications-list li small {
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>My Notifications</h1>
          <ul class="notifications-list">
    `;

    if (rows.length === 0) {
      html += `<li>No notifications yet.</li>`;
    } else {
      for (const note of rows) {
        html += `
          <li>
            <strong>${note.type}</strong><br>
            ${note.message}<br>
            <small>${new Date(note.date_sent).toLocaleDateString()}</small>
          </li>
        `;
      }
    }

    html += `
          </ul>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error displaying notifications:", err);
    res.status(500).send("Error displaying notifications.");
  }
});

module.exports = router;
