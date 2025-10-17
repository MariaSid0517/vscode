// backend/login_and_registration/login.js
function validateLoginFields(email, password, role) {
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!email || !password || !role) {
    return { valid: false, error: "All fields are required." };
  }

  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email format." };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters." };
  }

  return { valid: true };
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginform");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginemail").value.trim();
        const password = document.getElementById("loginpassword").value.trim();
        const role = document.getElementById("loginrole").value;

        const validation = validateLoginFields(email, password, role);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        alert(`Login successful as ${role}!`);
        // Actual login logic (fetch/backend) would go here
      });
    }
  });
}

module.exports = { validateLoginFields };
