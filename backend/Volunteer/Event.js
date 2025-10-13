document.addEventListener("DOMContentLoaded", () => {
  const events = [
    {
      name: "Community Clean-Up Drive",
      date: "2025-10-20",
      time: "9:00 AM - 12:00 PM",
      location: "Downtown Park",
      role: "Team Leader",
      status: "Confirmed"
    },
    {
      name: "Food Bank Distribution",
      date: "2025-10-25",
      time: "1:00 PM - 4:00 PM",
      location: "Houston Food Center",
      role: "Volunteer",
      status: "Pending"
    },
    {
      name: "Holiday Toy Drive",
      date: "2025-12-10",
      time: "10:00 AM - 2:00 PM",
      location: "Community Hall",
      role: "Event Organizer",
      status: "Completed"
    }
  ];

  const tbody = document.querySelector("#eventsTable tbody");

  events.forEach(event => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.date}</td>
      <td>${event.time}</td>
      <td>${event.location}</td>
      <td>${event.role}</td>
      <td class="status-${event.status.toLowerCase()}">${event.status}</td>
    `;
    tbody.appendChild(row);
  });
});
