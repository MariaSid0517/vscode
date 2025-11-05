console.log("login.js loaded");

function validateLoginFields(email, password) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) return { valid: false, error: "Email and password are required." };
  if (!emailPattern.test(email)) return { valid: false, error: "Invalid email address." };
  return { valid: true };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginform");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginemail").value.trim();
    const password = document.getElementById("loginpassword").value.trim();

    const validation = validateLoginFields(email, password);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) alert("Invalid email or password.");
        else throw new Error(`Login failed: HTTP ${res.status}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      if (data.role === "volunteer") {
        window.location.href = "../Volunteer/UserProfile/userprofile.html";
      } else if (data.role === "admin") {
        window.location.href = "../Admin/Event/EventForm.html";
      } else {
        alert("Unknown user role. Please contact support.");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    }
  });
});

if (typeof module !== "undefined") {
  module.exports = { validateLoginFields };
}
