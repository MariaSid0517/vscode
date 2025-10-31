let volunteers = [];
const volunteerSelect = document.getElementById("volunteer");
const form = document.getElementById("notificationForm");

// Fetch volunteers from backend
async function loadVolunteers() {
  try {
    const res = await fetch("/volunteers");
    volunteers = await res.json();
    volunteerSelect.innerHTML = `<option value="0">All Volunteers</option>`;
    volunteers.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.id;
      opt.textContent = v.name;
      volunteerSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading volunteers:", err);
  }
}

// Send notification
async function sendNotification(e) {
  e.preventDefault();
  const volunteerId = parseInt(volunteerSelect.value);
  const type = document.getElementById("notificationType").value;
  const message = document.getElementById("message").value.trim();

  if (!type || !message) {
    alert("All fields are required.");
    return;
  }

  try {
    const res = await fetch("/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteer_id: volunteerId, type, message })
    });
    const data = await res.json();
    alert("Notification sent!");
    form.reset();
    volunteerSelect.value = "0";
  } catch (err) {
    console.error("Error sending notification:", err);
    alert("Failed to send notification.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadVolunteers();
  form.addEventListener("submit", sendNotification);
});

export { loadVolunteers, sendNotification };
