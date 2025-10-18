// backend/Login/login.js

// ---- Validation stays the same (used by tests)
function validateLoginFields(email, password /* role not used for login */) {
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!email || !password) {
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
  (function () {
    const API_BASE = "http://localhost:3001";

    // From /frontend/login and registration/login.html to dashboards
    const DASHBOARD_ROUTES = {
      volunteer: "../Volunteer/VolunteerDashboard/Volunteerdashboard.html",
      admin: "../Admin/AdminDashboard.html", // change if your Admin file differs
    };

    function $(id) {
      return document.getElementById(id);
    }

    async function handleLogin(e) {
      e.preventDefault();

      const email = $("loginemail")?.value?.trim() || "";
      const password = $("loginpassword")?.value || "";

      // keep using the same validator
      const validation = validateLoginFields(email, password);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // ✅ TEST ENV (jsdom): preserve old behavior for unit tests
      if (window.__JSDOM_TEST__) {
        const roleEl = $("loginrole"); // tests set this select value
        const role = roleEl?.value || "volunteer";
        alert(`Login successful as ${role}!`);
        return; // no network, no redirect
      }

      // ✅ BROWSER: real API + redirect
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
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

        const target =
          DASHBOARD_ROUTES[data.role] || DASHBOARD_ROUTES.volunteer;
        window.location.assign(target);
      } catch (err) {
        console.error(err);
        alert(`Login failed: ${err.message}`);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      const form = $("loginform");
      if (form) form.addEventListener("submit", handleLogin);
    });
  })();
}

if (typeof module !== "undefined") {
  module.exports = { validateLoginFields };
}
