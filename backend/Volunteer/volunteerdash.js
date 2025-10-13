document.addEventListener("DOMContentLoaded", () => {
  // Hardcoded volunteer stats
  const volunteerStats = {
    totalEvents: 5,
    totalHours: 42,
    upcomingEvents: 2,
  };

  // Hardcoded recent event participation
  const eventHistory = [
    { name: "Beach Cleanup", date: "2025-10-05", role: "Participant", status: "Completed" },
    { name: "Food Drive", date: "2025-10-10", role: "Organizer", status: "Completed" },
    { name: "Community Fair", date: "2025-11-01", role: "Volunteer", status: "Upcoming" },
  ];

  // Update stats
  document.getElementById("total-events").textContent = volunteerStats.totalEvents;
  document.getElementById("total-hours").textContent = volunteerStats.totalHours;
  document.getElementById("upcoming-events").textContent = volunteerStats.upcomingEvents;

  // Populate table
  const tableBody = document.getElementById("event-history");
  eventHistory.forEach(event => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.date}</td>
      <td>${event.role}</td>
      <td>${event.status}</td>
    `;
    tableBody.appendChild(row);
  });
});
