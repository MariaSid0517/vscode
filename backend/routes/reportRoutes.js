// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

/**
 * Fetch event + volunteer assignment data.
 * Uses your schema:
 *  - eventdetails
 *  - states
 *  - volunteermatches (match_id, user_id, volunteer_id, event_id, created_at, status)
 *  - userprofile (profile_id, first_name, last_name, ...)
 */
async function getEventVolunteerData(eventId) {
  let query = `
    SELECT 
      e.event_id,
      e.event_name,
      e.event_description,
      e.event_date,
      e.location,
      s.state_name,
      e.max_volunteers,
      e.required_skills,
      e.urgency,

      vm.match_id,
      vm.volunteer_id,
      vm.status AS assignment_status,
      vm.created_at AS assigned_at,

      up.first_name,
      up.last_name
    FROM eventdetails e
    LEFT JOIN states s 
      ON e.state_id = s.state_id
    LEFT JOIN volunteermatches vm 
      ON e.event_id = vm.event_id
    LEFT JOIN userprofile up 
      ON vm.volunteer_id = up.profile_id
  `;

  const params = [];

  if (eventId) {
    query += ' WHERE e.event_id = ?';
    params.push(eventId);
  }

  query += `
    ORDER BY e.event_date DESC, e.event_name ASC, up.last_name ASC, up.first_name ASC;
  `;

  const [rows] = await db.query(query, params);
  return rows;
}

/**
 * GET /reports/events
 * Query params:
 *  - format: json | csv | pdf  (default: json)
 *  - event_id: optional filter for a single event
 */
router.get('/events', async (req, res) => {
  const format = (req.query.format || 'json').toLowerCase();
  const eventId = req.query.event_id ? Number(req.query.event_id) : null;

  try {
    const data = await getEventVolunteerData(eventId);

    // ---------- CSV ----------
    if (format === 'csv') {
      const fields = [
        'event_id',
        'event_name',
        'event_description',
        'event_date',
        'location',
        'state_name',
        'max_volunteers',
        'required_skills',
        'urgency',
        'match_id',
        'volunteer_id',
        'first_name',
        'last_name',
        'assignment_status',
        'assigned_at'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="event_volunteer_report.csv"'
      );
      return res.status(200).send(csv);
    }

    // ---------- PDF ----------
    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="event_volunteer_report.pdf"'
      );

      doc.pipe(res);

      // Title
      doc.fontSize(20).text('Event & Volunteer Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, {
        align: 'center'
      });
      doc.moveDown(1.5);

      // Group rows by event
      const eventsMap = new Map();
      for (const row of data) {
        if (!eventsMap.has(row.event_id)) {
          eventsMap.set(row.event_id, {
            info: row,
            volunteers: []
          });
        }
        if (row.volunteer_id) {
          eventsMap.get(row.event_id).volunteers.push(row);
        }
      }

      for (const [id, { info, volunteers }] of eventsMap.entries()) {
        doc.fontSize(14).text(info.event_name || 'Untitled Event', {
          underline: true
        });

        doc.moveDown(0.2);
        doc.fontSize(10)
          .text(`Event ID: ${id}`)
          .text(
            `Date: ${
              info.event_date
                ? new Date(info.event_date).toLocaleDateString()
                : 'N/A'
            }`
          )
          .text(
            `Location: ${info.location || 'N/A'}${
              info.state_name ? ', ' + info.state_name : ''
            }`
          )
          .text(`Urgency: ${info.urgency || 'N/A'}`)
          .text(
            `Max Volunteers: ${
              info.max_volunteers != null ? info.max_volunteers : 'N/A'
            }`
          )
          .text(`Required Skills: ${info.required_skills || 'N/A'}`);
        doc.moveDown(0.3);
        doc.text(`Description: ${info.event_description || 'N/A'}`);
        doc.moveDown(0.7);

        doc.fontSize(11).text('Volunteers:', { underline: true });
        doc.moveDown(0.2);

        if (!volunteers.length) {
          doc.fontSize(10).text('No volunteers assigned.', { italic: true });
        } else {
          volunteers.forEach((v, idx) => {
            const nameLine = `${idx + 1}. ${v.first_name || ''} ${
              v.last_name || ''
            } (Volunteer ID: ${v.volunteer_id || 'N/A'})`;
            doc.fontSize(10).text(nameLine);
            doc.text(
              `    Status: ${v.assignment_status || 'N/A'} | Assigned: ${
                v.assigned_at
                  ? new Date(v.assigned_at).toLocaleString()
                  : 'N/A'
              }`
            );
            doc.moveDown(0.3);
          });
        }

        doc.moveDown(1);

        if (doc.y > 700) {
          doc.addPage();
        }
      }

      doc.end();
      return;
    }

    // ---------- JSON (default) ----------
    return res.json(data);
  } catch (err) {
    console.error('Error generating event report:', err);
    return res
      .status(500)
      .json({ error: 'Failed to generate event/volunteer reports' });
  }
});

module.exports = router;
