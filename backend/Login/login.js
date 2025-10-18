// backend/Login/login.js

function validateLoginFields(email, password) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return { valid: false, error: "All fields are required." };
  }

  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }

  return { valid: true };
}

if (typeof module !== "undefined") {
  module.exports = { validateLoginFields };
}
