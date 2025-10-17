function loadVolunteerHistory() {
  const historyBody = document.getElementById("historyBody");

  if (!historyBody) {
    console.error("Missing #historyBody element in HTML");
    return;
  }

  // Simulated backend data
  const volunteerData = [
    {
      name: "Maria Siddeeque",
      event: "Health Fair 2025",
      date: "2025-03-12",
      location: "Houston, TX",
      skills: "Medical Assistance",
      urgency: "High",
      status: "Completed"
    },
    {
      name: "Matthew Reyna",
      event: "Dental Checkup Drive",
      date: "2025-04-02",
      location: "Austin, TX",
      skills: "Logistics",
      urgency: "Medium",
      status: "Attended"
    }
  ];

  // Clear existing rows
  historyBody.innerHTML = "";

  volunteerData.forEach(record => {
    // Validate required fields
    if (!record.name || !record.event || !record.date) {
      console.warn("Invalid record skipped:", record);
      return;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.event}</td>
      <td>${record.date}</td>
      <td>${record.location}</td>
      <td>${record.skills}</td>
      <td>${record.urgency}</td>
      <td>${record.status}</td>
    `;

    historyBody.appendChild(row);
  });
}

// Auto-run in browser
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", loadVolunteerHistory);
}

module.exports = { loadVolunteerHistory };