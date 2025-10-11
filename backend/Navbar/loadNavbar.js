// backend/Navbar/loadNavbar.js
export function loadNavbar() {
  fetch("../Navbar/navbar.html")
    .then(response => response.text())
    .then(data => {
      const placeholder = document.getElementById("navbar-placeholder");
      if (!placeholder) return;
      placeholder.innerHTML = data;

      const navHome = document.getElementById("nav-home");
      const navEvents = document.getElementById("nav-events");
      const navMatching = document.getElementById("nav-matching");
      const navHistory = document.getElementById("nav-history");
      const navLinks = [navHome, navEvents, navMatching, navHistory].filter(Boolean);

      function setActive(link) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }

      if (navHome) {
        navHome.addEventListener("click", () => {
          showTab("home");
          setActive(navHome);
        });
      }

      if (navEvents) {
        navEvents.addEventListener("click", () => {
          showTab("events");
          setActive(navEvents);
        });
      }

      if (navMatching) {
        navMatching.addEventListener("click", () => {
          showTab("matching");
          setActive(navMatching);
        });
      }

      if (navHistory) {
        navHistory.addEventListener("click", () => {
          showTab("history");
          setActive(navHistory);
        });
      }
    })
    .catch(err => console.error("Error loading navbar:", err));
}
