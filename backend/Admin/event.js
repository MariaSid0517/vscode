/**function validateEvent(event) {
  const errors = [];

  // Type validations
  if (event.name && typeof event.name !== "string") errors.push("Event name must be a string.");
  if (event.description && typeof event.description !== "string") errors.push("Description must be a string.");
  if (event.location && typeof event.location !== "string") errors.push("Location must be a string.");
  if (event.date && isNaN(Date.parse(event.date))) errors.push("Event date must be valid.");

  // Required fields
  if (!event.name || event.name.trim() === "") errors.push("Event name is required.");
  if (!event.description || event.description.trim() === "") errors.push("Description is required.");
  if (!event.location || event.location.trim() === "") errors.push("Location is required.");
  if (!event.date || isNaN(Date.parse(event.date))) errors.push("Event date is required or invalid.");

  // Optional: numeric checks
  if (event.max_volunteers && isNaN(event.max_volunteers)) errors.push("Max volunteers must be a number.");

  // Length validations
  if (event.name && event.name.length > 150) errors.push("Event name cannot exceed 150 characters.");
  if (event.description && event.description.length > 1000) errors.push("Description cannot exceed 1000 characters.");
  if (event.location && event.location.length > 255) errors.push("Location cannot exceed 255 characters.");

  return errors;
}

module.exports = { validateEvent };**/

// event.js
function validateEvent(event) {
  const errors = [];
  // Type validations
  if (event.name && typeof event.name !== "string") errors.push("Event name must be a string.");
  if (event.description && typeof event.description !== "string") errors.push("Description must be a string.");
  if (event.location && typeof event.location !== "string") errors.push("Location must be a string.");
  if (event.date && isNaN(Date.parse(event.date))) errors.push("Event date must be valid.");
  
  // Required fields
  if (!event.name || String(event.name).trim() === "") errors.push("Event name is required.");
  if (!event.description || String(event.description).trim() === "") errors.push("Description is required.");
  if (!event.location || String(event.location).trim() === "") errors.push("Location is required.");
  if (!event.date || isNaN(Date.parse(event.date))) errors.push("Event date is required or invalid.");
  
  // Optional: numeric checks
  if (event.max_volunteers && isNaN(event.max_volunteers)) errors.push("Max volunteers must be a number.");
  
  // Length validations
  if (event.name && event.name.length > 150) errors.push("Event name cannot exceed 150 characters.");
  if (event.description && event.description.length > 1000) errors.push("Description cannot exceed 1000 characters.");
  if (event.location && event.location.length > 255) errors.push("Location cannot exceed 255 characters.");

  return errors;
}

// NEW: function to attach form listener
function attachEventFormListener() {
  const form = document.getElementById("eventForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventData = {
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      date: document.getElementById('date').value,
      location: document.getElementById('location').value.trim(),
      state_id: parseInt(document.getElementById('state').value) || null,
      max_volunteers: parseInt(document.getElementById('max_volunteers').value) || null,
      required_skills: document.getElementById('required_skills').value.trim(),
      urgency: document.getElementById('urgency').value.trim()
    };

    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(" Event added successfully!");
        form.reset();
      } else {
        alert(" Error: " + JSON.stringify(data.errors || data.error));
      }
    } catch (err) {
      alert(" Could not connect to backend.");
    }
  });
}

module.exports = { validateEvent, attachEventFormListener };

