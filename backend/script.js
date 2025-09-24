document.addEventListener("DOMContentLoaded", () => {
  // Get current page form
  const form = document.getElementById("form");

  if (!form) return; // safety check

  // Detect if this is signup page
  if (document.title.includes("Signup")) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email-input").value.trim();
      const password = document.getElementById("password-input").value.trim();
      const repeatPassword = document.getElementById("repeat-password-input").value.trim();

      if (!email || !password || !repeatPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      // Save credentials (localStorage simulates backend)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      alert("Registration successful! Redirecting to your profile...");
      window.location.href = "../../../frontend/User Profile/userprofile.html";
    });
  }

  // Detect if this is login page
  if (document.title.includes("Login")) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = form.querySelector('input[type="email"]').value.trim();
      const password = form.querySelector('input[type="password"]').value.trim();

      const savedEmail = localStorage.getItem("userEmail");
      const savedPassword = localStorage.getItem("userPassword");

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      if (email === savedEmail && password === savedPassword) {
        alert(`Welcome back, ${email}!`);
        // redirect to dashboard/home page later
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }
});