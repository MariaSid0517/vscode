// backend/Login/registration.js

console.log("registration.js loaded");

function validateRegistrationFields(email, password, confirmPassword, role) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRoles = ["volunteer", "admin"];

  if (!email || !password || !confirmPassword || !role) {
    return { valid: false, error: "All fields are required." };
  }
  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email address." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain an uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain a lowercase letter." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Password must contain a number." };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, error: "Password must contain a special character." };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match." };
  }
  if (!validRoles.includes(role.toLowerCase())) {
    return { valid: false, error: "Invalid role selected." };
  }

  return { valid: true };
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(" Registration page ready");

  const form = document.getElementById("registrationform");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = document.getElementById("role").value;

    const validation = validateRegistrationFields(email, password, confirmPassword, role);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        throw new Error(`Registration failed: HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log(" Registered:", data);
      alert("Registration successful!");
      window.location.href = "login.html";
    } catch (err) {
      console.error(" Registration error:", err);
      alert("Registration failed: " + err.message);
    }
  });
});

// Export for Jest tests
if (typeof module !== "undefined") {
  module.exports = { validateRegistrationFields };
}
