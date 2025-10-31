document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id"); // or however you store logged-in user's ID
  if (!userId) {
    console.error("No user_id found. Make sure the volunteer is logged in.");
    return;
  }

  const tbody = document.querySelector("#eventsTable tbody");
  tbody.innerHTML = "<tr><td colspan='6'>Loading events...</td></tr>";

  try {
    const res = await fetch(`http://localhost:3000/match/list?user_id=${userId}`);
    const matches = await res.json();

    if (matches.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>No matched events found.</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    matches.forEach(match => {
      const e = match.event;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.name}</td>
        <td>${e.date || "-"}</td>
        <td>${e.time || "-"}</td>
        <td>${e.location || "-"}</td>
        <td>${e.role || "Volunteer"}</td>
        <td class="status-${(e.status || "Pending").toLowerCase()}">${e.status || "Pending"}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading volunteer events:", err);
    tbody.innerHTML = "<tr><td colspan='6'>Failed to load events.</td></tr>";
  }
});
