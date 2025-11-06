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

module.exports = { validateEvent }; **/

function validateEvent(event) {
  const errors = [];

  // Type validations
  if (event.name && typeof event.name !== "string") errors.push("Event name must be a string.");
  if (event.description && typeof event.description !== "string") errors.push("Description must be a string.");
  if (event.location && typeof event.location !== "string") errors.push("Location must be a string.");
  if (event.date && isNaN(Date.parse(event.date))) errors.push("Event date must be valid.");

  // Required fields (safely handle non-strings)
  const name = typeof event.name === "string" ? event.name.trim() : "";
  const description = typeof event.description === "string" ? event.description.trim() : "";
  const location = typeof event.location === "string" ? event.location.trim() : "";

  if (name === "") errors.push("Event name is required.");
  if (description === "") errors.push("Description is required.");
  if (location === "") errors.push("Location is required.");
  if (!event.date || isNaN(Date.parse(event.date))) errors.push("Event date is required or invalid.");

  // Optional: numeric checks
  if (event.max_volunteers != null && isNaN(Number(event.max_volunteers))) errors.push("Max volunteers must be a number.");

  // Length validations
  if (name.length > 150) errors.push("Event name cannot exceed 150 characters.");
  if (description.length > 1000) errors.push("Description cannot exceed 1000 characters.");
  if (location.length > 255) errors.push("Location cannot exceed 255 characters.");

  return errors;
}

module.exports = { validateEvent };



