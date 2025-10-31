const container = document.getElementById("notificationsList");

async function loadNotifications() {
  try {
    const res = await fetch("/notifications");
    const notifications = await res.json();

    if (!container) return;
    container.innerHTML = "";
    notifications.forEach(n => {
      const div = document.createElement("div");
      div.className = `notification-card ${n.read ? "" : "unread"}`;
      div.innerHTML = `
        <p><strong>${n.type}</strong>: ${n.message}</p>
        <p>Date: ${n.date_sent}</p>
        ${!n.read ? '<button class="mark-read-btn">Mark as Read</button>' : ''}
      `;
      container.appendChild(div);

      if (!n.read) {
        div.querySelector(".mark-read-btn").addEventListener("click", async () => {
          await fetch(`/notifications/read/${n.id}`, { method: "POST" });
          div.classList.remove("unread");
          div.querySelector(".mark-read-btn").remove();
        });
      }
    });
  } catch (err) {
    if (container) container.innerHTML = "<p>Error loading notifications.</p>";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadNotifications);
