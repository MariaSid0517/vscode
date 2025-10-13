document.addEventListener("DOMContentLoaded", () => {
  const notifications = [
    {
      id: 1,
      title: "Event Assignment: Community Clean-Up Drive",
      message: "You have been assigned to the 'Community Clean-Up Drive' on October 20th at Downtown Park.",
      time: "2025-10-12 10:00 AM",
      read: false
    },
    {
      id: 2,
      title: "Event Update: Food Bank Distribution",
      message: "The start time for 'Food Bank Distribution' has been changed to 1:30 PM.",
      time: "2025-10-11 3:45 PM",
      read: true
    },
    {
      id: 3,
      title: "Reminder: Submit Availability for November",
      message: "Please update your availability for upcoming November volunteer events.",
      time: "2025-10-10 8:15 AM",
      read: false
    }
  ];

  const list = document.getElementById("notificationsList");

  function renderNotifications() {
    list.innerHTML = "";

    notifications.forEach(notif => {
      const card = document.createElement("div");
      card.classList.add("notification-card");
      if (!notif.read) card.classList.add("unread");

      card.innerHTML = `
        <div class="notification-header">
          <span class="notification-title">${notif.title}</span>
          <span class="notification-time">${notif.time}</span>
        </div>
        <div class="notification-body">${notif.message}</div>
        ${
          !notif.read
            ? `<button class="mark-read-btn" data-id="${notif.id}">Mark as Read</button>`
            : ""
        }
      `;

      list.appendChild(card);
    });

    // Attach click event to mark as read buttons
    document.querySelectorAll(".mark-read-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        renderNotifications(); // re-render to update view
      });
    });
  }

  renderNotifications();
});
