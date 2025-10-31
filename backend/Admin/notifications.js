let notifications = [
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

// Validation function
function validateNotification({ volunteer, type, message }) {
  if (!volunteer || !type || !message) return { valid: false, error: "All fields are required." };
  if (volunteer.length > 50) return { valid: false, error: "Volunteer name too long." };
  if (type.length > 30) return { valid: false, error: "Type too long." };
  if (message.length > 500) return { valid: false, error: "Message too long." };
  return { valid: true };
}

// Function to add a notification
function addNotification(notification) {
  const validation = validateNotification(notification);
  if (!validation.valid) return validation;
  const newNotification = { ...notification, date: new Date().toISOString().split("T")[0] };
  notifications.push(newNotification);
  return { valid: true, notification: newNotification };
}

// Export functions and data
module.exports = { notifications, validateNotification, addNotification };