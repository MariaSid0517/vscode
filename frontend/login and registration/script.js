document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerform");
  const loginForm = document.getElementById("loginform");
  const profileForm = document.getElementById("profileForm");

  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email-input").value;
      const password = document.getElementById("password-input").value;
      const repeatpassword = document.getElementById("repeat-password-input").value;
      const role = document.getElementById("regRole").value;

      if (!email || !password || !repeatpassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== repeatpassword) {
        alert("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      // Save to localStorage (simulate DB)
      localStorage.setItem("user", JSON.stringify({ email, password, repeatpassword, role }));

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
          window.location.href = "../AdminDashboard/Admindash.html";
        } else {
          window.location.href = "../VolunteerDashboard/Volunteerdashboard.html";
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

function addDate() {
  const container = document.getElementById("availability-container");
  const input = document.createElement("input");
  input.type = "date";
  input.name = "availability[]";
  container.appendChild(document.createElement("br"));
  container.appendChild(input);
}
