document.addEventListener("DOMContentLoaded", async () => {
  const API = "http://localhost:3000/match";
  const tbody = document.querySelector("#eventsTable tbody");
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    tbody.innerHTML = `<tr><td colspan="6">Please log in to view your events.</td></tr>`;
    return;
  }

  try {
    const res = await fetch(`${API}/my?user_id=${userId}`);
    if (!res.ok) throw new Error("Server error: " + res.status);

    const events = await res.json();

    if (events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No matched events found.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";
    events.forEach((ev) => {
      const e = ev.event;
      const eventDate = e.date ? new Date(e.date).toLocaleDateString() : "—";
      const matchedDate = new Date(ev.matched_at).toLocaleDateString();
      const matchedTime = new Date(ev.matched_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.name}</td>
        <td>${eventDate}</td>
        <td>—</td>
        <td>${e.location}</td>
        <td>${matchedDate} ${matchedTime}</td>
        <td>
          <button class="complete-btn" data-id="${e.id}">Mark Completed</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error:", err);
    tbody.innerHTML = `<tr><td colspan="6">Error loading events: ${err.message}</td></tr>`;
  }
});

// ✅ Handle “Mark Completed” button click
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("complete-btn")) {
    const eventId = e.target.getAttribute("data-id");
    const userId = localStorage.getItem("user_id");

    if (!confirm("Are you sure you want to mark this event as completed?")) return;

    try {
      const res = await fetch("http://localhost:3000/match/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, event_id: eventId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Event marked as completed!");
        e.target.textContent = "Completed ✅";
        e.target.disabled = true;
        e.target.style.backgroundColor = "#28a745";
      } else {
        alert(data.error || "Failed to update event status.");
      }
    } catch (err) {
      console.error("Error completing event:", err);
      alert("Something went wrong while updating event status.");
    }
  }
});
