document.addEventListener("DOMContentLoaded", () => {
  const historyBody = document.getElementById("historyBody");

  // Hardcoded data for now (will be replaced by database later)
  const volunteerHistory = [
    {
      eventName: "Community Cleanup",
      description: "Neighborhood cleanup to promote environmental awareness.",
      location: "Houston Park, TX",
      skills: ["Teamwork", "Leadership"],
      urgency: "Medium",
      date: "2025-09-12",
      status: "completed",
    },
    {
      eventName: "Food Bank Support",
      description: "Assisting in organizing and distributing food donations.",
      location: "Downtown Food Bank",
      skills: ["Communication", "Organization"],
      urgency: "High",
      date: "2025-08-21",
      status: "pending",
    },
    {
      eventName: "Senior Center Tech Help",
      description: "Helping seniors learn how to use smartphones and apps.",
      location: "Sunrise Senior Center",
      skills: ["Technical", "Patience"],
      urgency: "Low",
      date: "2025-07-14",
      status: "completed",
    },
    {
      eventName: "Disaster Relief Drive",
      description: "Collecting and sorting emergency supplies for affected families.",
      location: "Community Hall",
      skills: ["Organization", "Teamwork"],
      urgency: "Critical",
      date: "2025-05-09",
      status: "cancelled",
    }
  ];

  // Populate the table
  volunteerHistory.forEach(event => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${event.eventName}</td>
      <td>${event.description}</td>
      <td>${event.location}</td>
      <td>${event.skills.join(", ")}</td>
      <td>${event.urgency}</td>
      <td>${event.date}</td>
      <td class="status ${event.status}">${event.status}</td>
    `;

    historyBody.appendChild(row);
  });
});
