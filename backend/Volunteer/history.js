document.addEventListener("DOMContentLoaded", async () => {
  const historyBody = document.getElementById("historyBody");
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    historyBody.innerHTML = `<tr><td colspan="7">Please log in to view your history.</td></tr>`;
    return;
  }

  try {
    // ✅ Correct endpoint
    const res = await fetch(`http://localhost:3000/match/completed?user_id=${userId}`);
    if (!res.ok) throw new Error("Server error: " + res.status);

    const events = await res.json();

    if (!events || events.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="7">No completed events yet.</td></tr>`;
      return;
    }

    historyBody.innerHTML = "";

    events.forEach((ev) => {
      const date = ev.event_date
        ? new Date(ev.event_date).toLocaleDateString()
        : "—";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ev.event_name}</td>
        <td>${ev.event_description || "—"}</td>
        <td>${ev.location || "—"}</td>
        <td>${ev.required_skills || "—"}</td>
        <td>${ev.urgency || "—"}</td>
        <td>${date}</td>
        <td class="status completed">Completed</td>
      `;
      historyBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    historyBody.innerHTML = `<tr><td colspan="7">Error loading history: ${err.message}</td></tr>`;
  }
});
