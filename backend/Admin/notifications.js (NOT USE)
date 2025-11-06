document.addEventListener("DOMContentLoaded", () => {
  loadVolunteers();

  const form = document.getElementById("notificationForm");
  form.addEventListener("submit", sendNotification);
});

// Load all volunteers into dropdown
async function loadVolunteers() {
  const volunteerSelect = document.getElementById("volunteer");

  try {
    const res = await fetch("http://localhost:3000/notifications/volunteers");
    const data = await res.json();

    volunteerSelect.innerHTML = `<option value="0">-- All Volunteers --</option>`;

    data.forEach(v => {
      const option = document.createElement("option");
      option.value = v.profile_id; // correct ID
      option.textContent = `${v.first_name} ${v.last_name}`;
      volunteerSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading volunteers:", err);
    alert("Error loading volunteer list.");
  }
}

// Send notification
async function sendNotification(e) {
  e.preventDefault();

  const volunteer_id = document.getElementById("volunteer").value;
  const type = document.getElementById("notificationType").value;
  const message = document.getElementById("message").value;

  if (!type || !message) {
    alert("Type and message are required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteer_id, type, message })
    });

    const result = await res.json();

    if (result.success) {
      alert("Notification sent!");
      document.getElementById("notificationForm").reset();
    } else {
      alert("Failed to send notification: " + (result.message || ""));
    }
  } catch (err) {
    console.error("Error sending:", err);
    alert("Server error sending notification.");
  }
}
