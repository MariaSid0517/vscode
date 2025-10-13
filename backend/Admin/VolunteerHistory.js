document.addEventListener("DOMContentLoaded", () => {
  const historyBody = document.getElementById("historyBody");

  // Simulate "database" for volunteer matches
  // These records would normally come from your match form
  // If you already store matches in localStorage, replace this array with that.
  const matches = JSON.parse(localStorage.getItem("matches")) || [
    {
      volunteerName: "Maria Siddeeque",
      eventName: "Mental Health Outreach",
      eventDate: "2025-11-12",
      location: "Downtown Community Center",
      skills: ["Communication", "Leadership"],
      urgency: "High",
      status: "Completed"
    },
    {
      volunteerName: "Matthew Reyna",
      eventName: "Health Clinic",
      eventDate: "2025-12-05",
      location: "Houston Medical Plaza",
      skills: ["Medical Support", "Teamwork"],
      urgency: "Critical",
      status: "Ongoing"
    },
    {
      volunteerName: "Madeeha Siddeeque",
      eventName: "Fundraiser Gala",
      eventDate: "2025-12-20",
      location: "City Hall Auditorium",
      skills: ["Fundraising", "Communication"],
      urgency: "Medium",
      status: "Cancelled"
    }
  ];

  function displayHistory() {
    historyBody.innerHTML = "";

    if (matches.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No volunteer participation records yet.</td></tr>`;
      return;
    }

    matches.forEach(record => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${record.volunteerName}</td>
        <td>${record.eventName}</td>
        <td>${record.eventDate}</td>
        <td>${record.location}</td>
        <td>${record.skills.join(", ")}</td>
        <td>${record.urgency}</td>
        <td><span class="status ${record.status.toLowerCase()}">${record.status}</span></td>
      `;
      historyBody.appendChild(tr);
    });
  }

  displayHistory();
});
