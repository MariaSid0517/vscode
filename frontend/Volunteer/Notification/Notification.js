/**document.addEventListener("DOMContentLoaded", async () => {
  const notificationsList = document.getElementById("notificationsList");
  const volunteerId = localStorage.getItem("user_id");

  if (!volunteerId) {
    notificationsList.innerHTML = "<p>Please log in to view notifications.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/notifications/volunteer/${volunteerId}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const notifications = await res.json();

    if (!notifications.length) {
      notificationsList.innerHTML = "<p>No notifications yet.</p>";
      return;
    }

    notificationsList.innerHTML = "";

    notifications.forEach(noti => {
      const date = new Date(noti.date_sent).toLocaleDateString();
      const time = new Date(noti.date_sent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const card = document.createElement("div");
      card.className = "notification-card";
      card.innerHTML = `
        <strong>${noti.type}</strong><br>
        ${noti.message}<br>
        <small>${date} ${time}</small>
      `;
      notificationsList.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading notifications:", err);
    notificationsList.innerHTML = "<p>Failed to load notifications. Please try again later.</p>";
  }
}); **/

document.addEventListener("DOMContentLoaded", async () => {
  const notificationsList = document.getElementById("notificationsList");
  const volunteerId = localStorage.getItem("user_id"); // must be user_id now

  if (!volunteerId) {
    notificationsList.innerHTML = "<p>Please log in to view notifications.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/notifications/volunteer/${volunteerId}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const notifications = await res.json();

    if (!notifications.length) {
      notificationsList.innerHTML = "<p>No notifications yet.</p>";
      return;
    }

    notificationsList.innerHTML = "";

    notifications.forEach(noti => {
      const date = new Date(noti.date_sent).toLocaleDateString();
      const time = new Date(noti.date_sent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const card = document.createElement("div");
      card.className = "notification-card";
      card.innerHTML = `
        <strong>${noti.type}</strong><br>
        ${noti.message}<br>
        <small>${date} ${time}</small>
      `;
      notificationsList.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading notifications:", err);
    notificationsList.innerHTML = "<p>Failed to load notifications. Please try again later.</p>";
  }
});

