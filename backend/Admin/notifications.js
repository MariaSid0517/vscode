document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("notificationForm");
  const volunteerSelect = document.getElementById("volunteer");

  // --- Load volunteers into dropdown ---
  try {
    const res = await fetch("http://localhost:3000/notifications/volunteers");
    if (!res.ok) throw new Error("Failed to fetch volunteers");

    const volunteers = await res.json();
    volunteerSelect.innerHTML = "<option value='0'>-- All Volunteers --</option>";
    volunteers.forEach(v => {
      const option = document.createElement("option");
      option.value = v.profile_id;
      option.textContent = `${v.first_name} ${v.last_name}`;
      volunteerSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading volunteers:", err);
    alert("Failed to load volunteers.");
  }

  // --- Handle form submission ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const volunteer_id = parseInt(volunteerSelect.value);
    const type = document.getElementById("notificationType").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!type || !message) {
      alert("Notification type and message are required.");
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
        alert("Notification sent successfully!");
        form.reset();
      } else {
        alert(data.error || "Failed to send notification.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending notification.");
    }
  });
});
