console.log("registration.js loaded");

function validateRegistrationFields(email, password, confirmPassword) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !confirmPassword) {
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

  return { valid: true };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationform");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    const validation = validateRegistrationFields(email, password, confirmPassword);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // role will default to volunteer in backend
      });

      if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed: " + err.message);
    }
  });
});

if (typeof module !== "undefined") {
  module.exports = { validateRegistrationFields };
}
