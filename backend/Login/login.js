// backend/Login/login.js

console.log(" login.js loaded");

function validateLoginFields(email, password) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return { valid: false, error: "Email and password are required." };
  }
  if (!emailPattern.test(email)) {
    return { valid: false, error: "Invalid email address." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  return { valid: true };
}

document.addEventListener("DOMContentLoaded", () => {
  console.log(" Login page initialized");

  const form = document.getElementById("loginform");
  if (!form) {
    console.error(" Login form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginemail").value.trim();
    const password = document.getElementById("loginpassword").value.trim();

    const validation = validateLoginFields(email, password);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const API_BASE = "http://localhost:3000";

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Invalid email or password.");
          return;
        }
        throw new Error(`Login failed: HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log(" Login success:", data);

      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);

      if (data.role === "volunteer") {
        const profileRes = await fetch(`${API_BASE}/profiles/${data.user_id}`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile && profile.first_name) {
            window.location.href = "../Volunteer/VolunteerDashboard/volunteerdashboard.html";
          } else {
            window.location.href = "../Volunteer/UserProfile/userprofile.html";
          }
        } else {
          window.location.href = "../Volunteer/UserProfile/userprofile.html";
        }
      } else if (data.role === "admin") {
        window.location.href = "../Admin/adminDashboard.html";
      } else {
        alert("Unknown user role. Please contact support.");
      }
    } catch (err) {
      console.error(" Login error:", err);
      alert("Login failed: " + err.message);
    }
  });
});

//  Make this available for Jest tests (Node environment)
if (typeof module !== "undefined") {
  module.exports = { validateLoginFields };
}
