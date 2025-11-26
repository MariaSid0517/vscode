// volunteerhistoryroutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { createObjectCsvWriter } = require("csv-writer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Ensure reports folder exists
const reportsDir = path.join(__dirname, "../reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

// Fetch volunteer history (JSON)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        vm.match_id,
        up.first_name,
        up.last_name,
        e.event_name,
        DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
        e.location,
        e.required_skills,
        e.urgency,
        vm.status AS participation_status
      FROM volunteermatches vm
      JOIN userprofile up ON vm.user_id = up.user_id
      JOIN eventdetails e ON vm.event_id = e.event_id
      ORDER BY e.event_date DESC;
    `);

    // Add full_name field
    const formatted = rows.map(r => ({
      ...r,
      volunteer_name: `${r.first_name} ${r.last_name}`
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching volunteer history:", err);
    res.status(500).json({ error: "Failed to fetch volunteer history" });
  }
});

// Report endpoint (JSON / CSV / PDF)
router.get("/report", async (req, res) => {
  const format = req.query.format || "json";

  try {
    const [rows] = await db.query(`
      SELECT
        vm.match_id,
        up.first_name,
        up.last_name,
        e.event_name,
        DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
        e.location,
        e.required_skills,
        e.urgency,
        vm.status AS participation_status
      FROM volunteermatches vm
      JOIN userprofile up ON vm.user_id = up.user_id
      JOIN eventdetails e ON vm.event_id = e.event_id
      ORDER BY e.event_date DESC;
    `);

    const formatted = rows.map(r => ({
      ...r,
      volunteer_name: `${r.first_name} ${r.last_name}`
    }));

    if (format === "json") {
      return res.json(formatted);
    }

    if (format === "csv") {
      const filePath = path.join(reportsDir, "volunteer_history.csv");

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: "volunteer_name", title: "Volunteer" },
          { id: "event_name", title: "Event" },
          { id: "event_date", title: "Event Date" },
          { id: "location", title: "Location" },
          { id: "required_skills", title: "Skills" },
          { id: "urgency", title: "Urgency" },
          { id: "participation_status", title: "Status" }
        ]
      });

      await csvWriter.writeRecords(formatted);
      return res.download(filePath);
    }

    if (format === "pdf") {
      const filePath = path.join(reportsDir, "volunteer_history.pdf");

      const pdfDoc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      pdfDoc.pipe(writeStream);

      pdfDoc.fontSize(20).text("Volunteer History Report", { underline: true });
      pdfDoc.moveDown();

      formatted.forEach((row, index) => {
        pdfDoc.fontSize(12).text(
          `${index + 1}. ${row.volunteer_name} - ${row.event_name} (${row.event_date})`
        );
        pdfDoc.text(
          ` Location: ${row.location} | Skills: ${row.required_skills} | Urgency: ${row.urgency}`
        );
        pdfDoc.text(` Status: ${row.participation_status}`);
        pdfDoc.moveDown();
      });

      pdfDoc.end();

      writeStream.on("finish", () => {
        res.download(filePath);
      });

      writeStream.on("error", (err) => {
        console.error("PDF write error:", err);
        res.status(500).json({ error: "PDF export failed" });
      });

      return;
    }

    res.status(400).json({ error: "Invalid report format" });
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: `Failed to generate report` });
  }
});

module.exports = router;
