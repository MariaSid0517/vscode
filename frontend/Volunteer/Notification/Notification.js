document.addEventListener("DOMContentLoaded", async () => {
  const API = "http://localhost:3000/notifications";
  const notificationsList = document.getElementById("notificationsList");
  const userId = localStorage.getItem("user_id");

  // Check login
  if (!userId) {
    notificationsList.innerHTML = `<p>Please log in to view your notifications.</p>`;
    return;
  }

  try {
    const res = await fetch(`${API}/${userId}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const notifications = await res.json();

    if (notifications.length === 0) {
      notificationsList.innerHTML = `<p>No new notifications at the moment.</p>`;
      return;
    }

    notificationsList.innerHTML = "";

    notifications.forEach(noti => {
      const urgency = (noti.urgency || "").toLowerCase();

      // Assign color based on urgency
      let urgencyClass = "";
      if (urgency === "high") urgencyClass = "urgent-high";
      else if (urgency === "medium") urgencyClass = "urgent-medium";
      else urgencyClass = "urgent-low";

      const date = new Date(noti.date_sent).toLocaleDateString();
      const time = new Date(noti.date_sent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const card = document.createElement("div");
      card.className = `notification-card ${urgencyClass}`;
      card.innerHTML = `
        <div class="notification-header">
          <span class="notification-title">${noti.type}</span>
          <span class="notification-time">${date} ${time}</span>
        </div>
        <div class="notification-body">${noti.message}</div>
        ${urgency ? `<div class="notification-urgency">Urgency: <strong>${urgency.toUpperCase()}</strong></div>` : ""}
      `;

      notificationsList.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading notifications:", err);
    notificationsList.innerHTML = `<p>Failed to load notifications. Please try again later.</p>`;
  }
});
