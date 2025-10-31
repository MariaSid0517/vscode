document.addEventListener("DOMContentLoaded", async () => {
  const volunteerId = 1; // Replace with logged-in volunteer's ID
  const container = document.querySelector(".notifications-container");

  try {
    const res = await fetch(`http://localhost:3000/notifications/volunteer/${volunteerId}`);
    const notifications = await res.json();

    if (notifications.length === 0) {
      container.innerHTML = "<p>No notifications yet.</p>";
      return;
    }

    const list = document.createElement("ul");
    notifications.forEach(n => {
      const li = document.createElement("li");
      li.textContent = `[${n.date_sent}] (${n.type}) ${n.message}`;
      list.appendChild(li);
    });

    container.appendChild(list);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading notifications.</p>";
  }
});
