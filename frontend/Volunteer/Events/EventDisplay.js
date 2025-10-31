document.addEventListener("DOMContentLoaded", async () => {
  const API = "http://localhost:3000/match/my";
  const tbody = document.querySelector("#eventsTable tbody");
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    tbody.innerHTML = `<tr><td colspan="5">Please log in to view your events.</td></tr>`;
    return;
  }

  try {
    const res = await fetch(`${API}?user_id=${userId}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const events = await res.json();

    if (events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No matched events found.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    events.forEach(ev => {
      const e = ev.event;
      const eventDate = e.date ? new Date(e.date).toLocaleDateString() : "—";
      const matchedDate = new Date(ev.matched_at).toLocaleDateString();
      const matchedTime = new Date(ev.matched_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.name}</td>
        <td>${eventDate}</td>
        <td>—</td>
        <td>${e.location}</td>
        <td>${matchedDate} ${matchedTime}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    tbody.innerHTML = `<tr><td colspan="5">Error loading events. Please try again later.</td></tr>`;
  }
});
