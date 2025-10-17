// backend/Login/registration.js

// ---- Validation stays the same (used by tests)
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
  (function () {
    const API_BASE = "http://localhost:3001";

    // From /frontend/login and registration/registration.html
    const ROUTES = {
      volunteerProfile: "../Volunteer/UserProfile/userprofile.html",
      adminDashboard: "../Admin/AdminDashboard.html", // change if your Admin file differs
    };

    function $(id) {
      return document.getElementById(id);
    }

    function getRole() {
      // your HTML uses id="role"
      const el = $("role") || $("regRole");
      return el?.value || "volunteer";
    }

    async function handleRegister(e) {
      e.preventDefault();

      const email = $("email-input")?.value?.trim() || "";
      const password = $("password-input")?.value || "";
      const repeatPassword = $("repeat-password-input")?.value || "";
      const role = getRole();

      const validation = validateRegistrationFields(
        email,
        password,
        repeatPassword,
        role
      );
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // In Jest/jsdom, don't hit network or redirect (keep unit tests stable)
      if (window.__JSDOM_TEST__) return;

      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg =
            data?.message ||
            data?.errors?.[0]?.message ||
            `HTTP ${res.status}`;
          throw new Error(msg);
        }

        const data = await res.json(); // { userId, token, role }
        try {
          localStorage.setItem("auth", JSON.stringify(data));
        } catch {}

        // ✅ After signup:
        // - Volunteers go to User Profile to complete info
        // - Admins go to Admin dashboard
        const target =
          role === "volunteer"
            ? ROUTES.volunteerProfile
            : ROUTES.adminDashboard;

        window.location.assign(target);
      } catch (err) {
        console.error(err);
        alert(`Signup failed: ${err.message}`);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      const form = $("registerform");
      if (form) form.addEventListener("submit", handleRegister);
    });
  })();
}

if (typeof module !== "undefined") {
  module.exports = { validateRegistrationFields };
}
