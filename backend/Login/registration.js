// backend/login_and_registration/registration.js
function validateRegistrationFields(email, password, repeatPassword, role) {
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!email || !password || !repeatPassword || !role) {
    return { valid: false, error: "All fields are required." };
  }

  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters." };
  }

  if (password !== repeatPassword) {
    return { valid: false, error: "Passwords do not match." };
  }

  return { valid: true };
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerform");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email-input").value.trim();
        const password = document.getElementById("password-input").value.trim();
        const repeatPassword = document.getElementById("repeat-password-input").value.trim();
        const role = document.getElementById("role").value;

        const validation = validateRegistrationFields(email, password, repeatPassword, role);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        alert(`Registration successful as ${role}!`);
        // Actual save logic would go here
      });
    }
  });
}

module.exports = { validateRegistrationFields };
