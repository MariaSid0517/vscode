function validateEvent(event) {
  const errors = [];

  // Field type validations first
  if (event.name && typeof event.name !== "string") errors.push("Event name must be a string.");
  if (event.description && typeof event.description !== "string") errors.push("Description must be a string.");
  if (event.location && typeof event.location !== "string") errors.push("Location must be a string.");
  if (event.skills && !Array.isArray(event.skills)) errors.push("Skills must be an array.");
  if (event.urgency && typeof event.urgency !== "string") errors.push("Urgency must be a string.");
  if (event.date && isNaN(Date.parse(event.date))) errors.push("Event date must be valid.");

  // Required field validations
  if (!event.name || (typeof event.name === "string" && event.name.trim() === "")) errors.push("Event name is required.");
  if (!event.description || (typeof event.description === "string" && event.description.trim() === "")) errors.push("Description is required.");
  if (!event.location || (typeof event.location === "string" && event.location.trim() === "")) errors.push("Location is required.");
  if (!event.skills || !Array.isArray(event.skills) || event.skills.length === 0) errors.push("At least one skill is required.");
  if (!event.urgency || (typeof event.urgency === "string" && event.urgency.trim() === "")) errors.push("Urgency is required.");
  if (!event.date || isNaN(Date.parse(event.date))) errors.push("Event date is required or invalid.");

  // Field length validations
  if (typeof event.name === "string" && event.name.length > 100) errors.push("Event name cannot exceed 100 characters.");
  if (typeof event.description === "string" && event.description.length > 500) errors.push("Description cannot exceed 500 characters.");
  if (typeof event.location === "string" && event.location.length > 200) errors.push("Location cannot exceed 200 characters.");

  return errors;
}

module.exports = { validateEvent };
