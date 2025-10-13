export function loadNavbar() {
  fetch("../Navbar/navbar.html")
    .then(response => response.text())
    .then(data => {
      const placeholder = document.getElementById("navbar-placeholder");
      if (!placeholder) return;
      placeholder.innerHTML = data;

      const navHome = document.getElementById("nav-home");
      const navProfile = document.getElementById("nav-profile");
      const navEvents = document.getElementById("nav-events");
      const navHistory = document.getElementById("nav-history");
      const navNotification = document.getElementById("nav-notifications");
      const navLogout = document.getElementById("nav-logout");

      const navLinks = [navHome, navProfile, navEvents, navHistory, navNotification, navLogout].filter(Boolean);

      function setActive(link) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }

      // Example: Redirect to pages or show tabs
      if (navHome) {
        navHome.addEventListener("click", () => {
          window.location.href = "../VolunteerDashboard/Volunteerdashboard.html"; // or showTab("home");
        });
      }

      if (navProfile) {
        navProfile.addEventListener("click", () => {
          window.location.href = "../UserProfile/userprofile.html";
        });
      }

      if (navEvents) {
        navEvents.addEventListener("click", () => {
          window.location.href = "../Events/Event.html";
        });
      }

      if (navHistory) {
        navHistory.addEventListener("click", () => {
          window.location.href = "../volunteer history/history.html";
        });
      }

      if (navNotification) {
        navNotification.addEventListener("click", () => {
          window.location.href = "../Notification/Notifications.html";
        });
      }

      if (navLogout) {
        navLogout.addEventListener("click", () => {
          // Example logout action
          localStorage.clear();
          window.location.href = "../../login and registration/login.html";
        });
      }
    })
    .catch(err => console.error("Error loading navbar:", err));
}