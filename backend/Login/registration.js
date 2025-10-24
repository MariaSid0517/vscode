// backend/Login/registration.js

function validateRegistrationFields(email, password, repeatPassword, role) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Required field checks
  if (!email || !password || !repeatPassword || !role) {
    return { valid: false, error: "All fields are required." };
  }

  // Email format check
  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  // Password strength check
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character." };
  }

  // Match check
  if (password !== repeatPassword) {
    return { valid: false, error: "Passwords do not match." };
  }

  // Role check
  if (role !== "volunteer" && role !== "admin") {
    return { valid: false, error: "Invalid role selected." };
  }

  return { valid: true };
}

if (typeof module !== "undefined") {
  module.exports = { validateRegistrationFields };
}
