document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("notificationForm");
  const historyTable = document.getElementById("notificationHistory");

  // Hardcoded notifications for now
  const notifications = [
    {
      volunteer: "Maria Siddeeque",
      type: "Event Assignment",
      message: "You have been assigned to the Mental Health Outreach event.",
      date: "2025-10-10"
    },
    {
      volunteer: "Matthew Reyna",
      type: "Reminder",
      message: "Don't forget the Health Clinic event tomorrow at 9 AM!",
      date: "2025-10-11"
    }
  ];

  // Function to display notifications
  function displayNotifications() {
    historyTable.innerHTML = "";
    notifications.forEach(note => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${note.volunteer}</td>
        <td>${note.type}</td>
        <td>${note.message}</td>
        <td>${note.date}</td>
      `;
      historyTable.appendChild(row);
    });
  }

  displayNotifications();

  // Handle sending new notifications
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const volunteer = document.getElementById("volunteer").value;
    const type = document.getElementById("notificationType").value;
    const message = document.getElementById("message").value;
    const date = new Date().toISOString().split("T")[0];

    if (!volunteer || !type || !message) {
      alert("Please fill out all fields.");
      return;
    }

    const newNotification = { volunteer, type, message, date };
    notifications.push(newNotification);

    displayNotifications();
    form.reset();

    alert(`Notification sent to ${volunteer}!`);
  });
});
