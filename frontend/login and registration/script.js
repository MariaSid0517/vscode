document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerform");
  const loginForm = document.getElementById("loginform");
  const profileForm = document.getElementById("profileForm");

  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("email-input").value;
      const email = document.getElementById("password-input").value;
      const password = document.getElementById("repeat-password-input").value;
      const role = document.getElementById("regRole").value;

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

      // Save to localStorage (simulate DB)
      localStorage.setItem("user", JSON.stringify({ name, email, password, role }));

    });
  }

  // Handle login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginemail").value;
      const password = document.getElementById("loginpassword").value;
      const role = document.getElementById("loginrole").value;

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser && storedUser.email === email && storedUser.password === password && storedUser.role === role) {
        alert("Login successful!");

        if (role === "admin") {
          window.location.href = "admin_dashboard.html";
        } else {
          window.location.href = "profile.html";
        }
      } else {
        alert("Invalid credentials or role!");
      }
    });
  }

   if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const profileData = {
        fullName: document.getElementById("fullName").value,
        address1: document.getElementById("address1").value,
        address2: document.getElementById("address2").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
        skills: Array.from(document.getElementById("skills").selectedOptions).map(opt => opt.value),
        preferences: document.getElementById("preferences").value,
        availability: document.getElementById("availability").value,
      };

      const updatedUser = { ...storedUser, ...profileData, profileComplete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile saved!");

      if (storedUser.role === "admin") {
        window.location.href = "../AdminDashboard/Admindashboard.html";
      } else {
        window.location.href = "../VolunteerDashboard/Volunteerdashboard.html";
      }
    });
  }
});