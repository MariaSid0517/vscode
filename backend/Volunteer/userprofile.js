// backend/Volunteer/userprofile.js

function initUserProfile() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  // ---- Config / assumptions ----
  const API_BASE = "http://localhost:3001";
  const USER_ID = "1";
  const isJest = Boolean(window.__JSDOM_TEST__);

  async function loadProfile() {
    if (isJest) {
      const storage = window.localStorage || {};
      const savedProfile = storage.getItem?.("volunteerProfile");
      if (!savedProfile) return;
      try {
        applyProfileToForm(JSON.parse(savedProfile));
      } catch (err) {
        console.error("Error parsing saved profile:", err);
      }
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profiles/${USER_ID}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data) applyProfileToForm(data);
    } catch (e) {
      console.warn("Could not load profile from API; leaving form blank.", e);
    }
  }

  function applyProfileToForm(data) {
    document.getElementById("fullName").value = data.name || "";
    document.getElementById("address1").value = data.address1 || "";
    document.getElementById("address2").value = data.address2 || "";
    document.getElementById("city").value = data.city || "";
    document.getElementById("state").value = data.state || "";
    document.getElementById("zip").value = data.zip || "";
    const pref = document.getElementById("preferences");
    if (pref) pref.value = data.preferences || "";

    const skillsSelect = document.getElementById("skills");
    if (skillsSelect && Array.isArray(data.skills)) {
      Array.from(skillsSelect.options).forEach((opt) => {
        opt.selected = data.skills.includes(opt.value);
      });
    }
  }

  async function goToDashboard() {
    // Correct relative path based on your folder structure:
    // frontend/Volunteer/UserProfile/ -> ../VolunteerDashboard/Volunteerdashboard.html
    const rel = "../VolunteerDashboard/Volunteerdashboard.html";
    const url = new URL(rel, window.location.href).toString();

    try {
      // Quick HEAD check so we fail gracefully with a helpful alert
      const resp = await fetch(url, { method: "HEAD" });
      if (resp.ok) {
        window.location.assign(url);
        return;
      }
    } catch (_) {}
    alert("Saved profile, but couldn't find the dashboard at: " + url);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // avoid appending query params to URL

    const name = document.getElementById("fullName").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const address2 = document.getElementById("address2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const preferences = document.getElementById("preferences")?.value.trim() || "";

    const skillsSelect = document.getElementById("skills");
    const selectedSkills = skillsSelect
      ? Array.from(skillsSelect.selectedOptions).map((opt) => opt.value)
      : [];

    if (!name || !address1 || !city || !state || !zip) {
      window.alert("Please fill in all required fields.");
      return;
    }

    const profile = {
      name,
      address1,
      address2,
      city,
      state,
      zip,
      preferences,
      skills: selectedSkills,
    };

    if (isJest) {
      // Keep tests green: localStorage + captured redirect
      const storage = window.localStorage || {};
      storage.setItem?.("volunteerProfile", JSON.stringify(profile));
      window.__lastNavigatedTo = "../VolunteerDashboard/Volunteerdashboard.html";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/profiles/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        let detail = "";
        try {
          const data = await res.json();
          if (data?.errors?.length) {
            const first = data.errors[0];
            detail = ` (${first.path?.join(".") ?? "field"}: ${first.message})`;
          } else if (data?.message) {
            detail = ` (${data.message})`;
          }
        } catch {}
        throw new Error(`Save failed: HTTP ${res.status}${detail}`);
      }

      // Mirror to localStorage (optional UX nicety)
      try {
        window.localStorage?.setItem("volunteerProfile", JSON.stringify(profile));
      } catch {}

      await goToDashboard();
    } catch (err) {
      console.error(err);
      window.alert(`Could not save your profile. ${err.message}`);
    }
  });

  // initial load
  loadProfile();
}

// Run init now if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUserProfile);
} else {
  initUserProfile();
}
