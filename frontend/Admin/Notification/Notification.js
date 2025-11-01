document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("notificationForm");
  const volunteerSelect = document.getElementById("volunteer");

  loadVolunteers();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const volunteer_id = parseInt(volunteerSelect.value);
    const type = document.getElementById("notificationType").value;
    const message = document.getElementById("message").value;

    if (!type || !message || isNaN(volunteer_id)) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id, type, message })
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Notification sent!");
        form.reset();
      } else {
        alert("❌ Failed: " + (data.message || "Server error"));
      }
    } catch (err) {
      console.error(err);
      alert("Server error sending notification.");
    }
  });
});

async function loadVolunteers() {
  const volunteerSelect = document.getElementById("volunteer");
  try {
    const res = await fetch("http://localhost:3000/notifications/volunteers");
    const volunteers = await res.json();

    volunteerSelect.innerHTML = `<option value="0">-- All Volunteers --</option>`;
    volunteers.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.volunteer_id;
      opt.textContent = `${v.first_name} ${v.last_name}`;
      volunteerSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading volunteer list:", err);
    alert("Error loading volunteers.");
  }
}
