document.addEventListener("DOMContentLoaded", async () => {
  const historyBody = document.getElementById("historyBody");

  try {
    const res = await fetch("http://localhost:3000/match/history");
    if (!res.ok) throw new Error("Server error: " + res.status);

    const records = await res.json();

    if (!records || records.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="7">No volunteer history found.</td></tr>`;
      return;
    }

    historyBody.innerHTML = "";

    records.forEach(rec => {
      const date = rec.event_date
        ? new Date(rec.event_date).toLocaleDateString()
        : "—";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${rec.volunteer_name}</td>
        <td>${rec.event_name}</td>
        <td>${date}</td>
        <td>${rec.location || "—"}</td>
        <td>${rec.required_skills || "—"}</td>
        <td>${rec.urgency || "—"}</td>
        <td class="status ${rec.status}">${rec.status}</td>
      `;
      historyBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading history:", err);
    historyBody.innerHTML = `<tr><td colspan="7">Error: ${err.message}</td></tr>`;
  }
});
