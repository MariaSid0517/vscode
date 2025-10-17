document.addEventListener("DOMContentLoaded", () => {
  const historyBody = document.getElementById("historyBody");

  //  Default hardcoded matches
  const defaultMatches = [
    {
      volunteerName: "Maria Siddeeque",
      eventName: "Community Cleanup",
      eventDate: "2025-09-12",
      location: "Houston Park, TX",
      skills: ["Teamwork", "Leadership"],
      urgency: "Medium",
      status: "completed",
    },
    {
      volunteerName: "Matthew Reyna",
      eventName: "Food Bank Support",
      eventDate: "2025-08-21",
      location: "Downtown Food Bank",
      skills: ["Communication", "Organization"],
      urgency: "High",
      status: "pending",
    },
    {
      volunteerName: "Madeeha Siddeeque",
      eventName: "Senior Center Tech Help",
      eventDate: "2025-07-14",
      location: "Sunrise Senior Center",
      skills: ["Technical", "Patience"],
      urgency: "Low",
      status: "completed",
    },
    {
      volunteerName: "Jane Doe",
      eventName: "Disaster Relief Drive",
      eventDate: "2025-05-09",
      location: "Community Hall",
      skills: ["Organization", "Teamwork"],
      urgency: "Critical",
      status: "cancelled",
    },
  ];

  //  If localStorage has matches, use those; otherwise use defaults
  const storedMatches = JSON.parse(localStorage.getItem("matches"));
  const matches =
    storedMatches && Array.isArray(storedMatches) && storedMatches.length > 0
      ? storedMatches
      : defaultMatches;

  // 🧼 Clear the table before rendering
  historyBody.innerHTML = "";

  // 📝 Render the matches
  matches.forEach((record) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.volunteerName}</td>
      <td>${record.eventName}</td>
      <td>${record.eventDate}</td>
      <td>${record.location}</td>
      <td>${record.skills.join(", ")}</td>
      <td>${record.urgency}</td>
      <td class="status ${record.status.toLowerCase()}">${record.status}</td>
    `;
    historyBody.appendChild(tr);
  });
});
