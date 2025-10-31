// backend/Volunteer/userprofile.js

function initUserProfile() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  const API_BASE = "http://localhost:3000";
  const USER_ID = localStorage.getItem("user_id") || "1"; // default for testing
  const isJest = Boolean(window.__JSDOM_TEST__);

  async function loadProfile() {
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
    document.getElementById("fullName").value = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();
    document.getElementById("address1").value = data.address || "";
    document.getElementById("city").value = data.city || "";
    document.getElementById("zip").value = data.zipcode || "";
    document.getElementById("preferences").value = data.preferences || "";
    document.getElementById("state").value = data.state_id || "";

    const skillsSelect = document.getElementById("skills");
    if (skillsSelect && data.skills) {
      const skillList = data.skills.split(",");
      Array.from(skillsSelect.options).forEach((opt) => {
        opt.selected = skillList.includes(opt.value);
      });
    }
  }

  async function goToDashboard() {
    const url = "../VolunteerDashboard/volunteerdashboard.html";
    window.location.assign(url);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const address2 = document.getElementById("address2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value; // numeric ID
    const zip = document.getElementById("zip").value.trim();
    const preferences = document.getElementById("preferences").value.trim();
    const skillsSelect = document.getElementById("skills");
    const selectedSkills = Array.from(skillsSelect.selectedOptions).map((opt) => opt.value);

    if (!name || !address1 || !city || !state || !zip) {
      alert("Please fill in all required fields.");
      return;
    }

    const profile = { name, address1, address2, city, state, zip, preferences, skills: selectedSkills };

    try {
      const res = await fetch(`${API_BASE}/profiles/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error(`Save failed: HTTP ${res.status}`);
      alert("Profile saved successfully!");
      await goToDashboard();
    } catch (err) {
      console.error(err);
      alert(`Could not save your profile. ${err.message}`);
    }
  });

  loadProfile();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUserProfile);
} else {
  initUserProfile();
}
