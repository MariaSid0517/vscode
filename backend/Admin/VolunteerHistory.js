document.addEventListener("DOMContentLoaded", async () => {
  const historyBody = document.getElementById("historyBody");

  try {
    const res = await fetch("http://localhost:3000/match/history");
    if (!res.ok) throw new Error("Server error: " + res.status);

    const records = await res.json();

    if (!records || records.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="7">No volunteer history found.</td></tr>`;
      return;
    }

    historyBody.innerHTML = "";

    records.forEach(rec => {
      const date = rec.event_date
        ? new Date(rec.event_date).toLocaleDateString()
        : "—";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${rec.volunteer_name}</td>
        <td>${rec.event_name}</td>
        <td>${date}</td>
        <td>${rec.location || "—"}</td>
        <td>${rec.required_skills || "—"}</td>
        <td>${rec.urgency || "—"}</td>
        <td class="status ${rec.status}">${rec.status}</td>
      `;
      historyBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    historyBody.innerHTML = `<tr><td colspan="7">Error: ${err.message}</td></tr>`;
  }
});


// DOM Elements
const toggleReportBtn = document.getElementById("toggleViewBtn");
const historyView = document.getElementById("historyView");
const reportView = document.getElementById("reportsView");
const reportFormat = document.getElementById("reportFormat");
const generateBtn = document.getElementById("generateReportBtn");
const reportOutput = document.getElementById("reportOutput");

const REPORT_API = "http://localhost:3000/match/history/report";

// Toggle between table view and report view
toggleReportBtn.addEventListener("click", () => {
  const showingReports = reportView.style.display !== "none";

  if (showingReports) {
    reportView.style.display = "none";
    historyView.style.display = "block";
    toggleReportBtn.textContent = "View Reports";
  } else {
    reportView.style.display = "block";
    historyView.style.display = "none";
    toggleReportBtn.textContent = "View Participation";
  }
});

// Generate Report (JSON preview, CSV/PDF download)
generateBtn.addEventListener("click", async () => {
  const format = reportFormat.value;

  // JSON Preview
  if (format === "json") {
    reportOutput.textContent = "Loading...";
    try {
      const res = await fetch(`${REPORT_API}?format=json`);
      const data = await res.json();
      reportOutput.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      reportOutput.textContent = "Error loading JSON report.";
    }
    return;
  }

  // CSV or PDF → direct download
  window.open(`${REPORT_API}?format=${format}`, "_blank");
});