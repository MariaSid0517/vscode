// loadNavbar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("../Navbar/navbar.html") // adjust path based on folder structure
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;
    })
    .catch(err => console.error("Error loading navbar:", err));
});
