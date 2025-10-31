// backend/Admin/event.js

console.log("event.js loaded");

// -----------------------------------------------------------------------------
// ✅ Validation function (used by Jest tests & real form validation)
// -----------------------------------------------------------------------------
function validateEvent(event) {
  const errors = [];

  if (!event || typeof event !== "object") return ["Invalid event object."];

  const name = typeof event.name === "string" ? event.name.trim() : "";
  const description = typeof event.description === "string" ? event.description.trim() : "";
  const location = typeof event.location === "string" ? event.location.trim() : "";
  const date = event.date;
  const skills = Array.isArray(event.skills) ? event.skills : [];
  const urgency = typeof event.urgency === "string" ? event.urgency.trim() : "";

  // Required fields
  if (!name) errors.push("Event name is required.");
  if (!description) errors.push("Description is required.");
  if (!location) errors.push("Location is required.");
  if (!date || isNaN(Date.parse(date))) errors.push("Event date is required or invalid.");
  if (skills.length === 0) errors.push("At least one skill is required.");
  if (!urgency) errors.push("Urgency is required.");

  // Length validation
  if (name.length > 100) errors.push("Event name cannot exceed 100 characters.");
  if (description.length > 500) errors.push("Description cannot exceed 500 characters.");
  if (location.length > 200) errors.push("Location cannot exceed 200 characters.");

  return errors;
}

// -----------------------------------------------------------------------------
// 🟢 Real browser functionality (runs only in browser)
// -----------------------------------------------------------------------------
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("eventForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const eventName = document.getElementById("eventName").value.trim();
      const description = document.getElementById("description").value.trim();
      const location = document.getElementById("location").value.trim();
      const date = document.getElementById("date").value;
      const skills = Array.from(
        document.querySelectorAll("input[name='skills']:checked")
      ).map((s) => s.value);
      const urgency = document.getElementById("urgency").value;

      const validationErrors = validateEvent({
        name: eventName,
        description,
        location,
        date,
        skills,
        urgency,
      });

      if (validationErrors.length > 0) {
        alert(validationErrors.join("\n"));
        return;
      }

      const eventData = { eventName, description, location, date, skills, urgency };

      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });

        if (res.ok) {
          alert("Event created successfully!");
          form.reset();
        } else {
          alert("Error creating event.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to create event.");
      }
    });
  });
}

// -----------------------------------------------------------------------------
// ✅ Export for Jest and Node backend
// -----------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validateEvent };
}
