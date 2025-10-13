document.addEventListener("DOMContentLoaded", () => {

  // Simple hash function for password simulation (for demo only)
  function hashPassword(pw) {
    return btoa(pw); // base64 encode as simple hash
  }

  // Initialize first admin if not exists
  if (!localStorage.getItem("users")) {
    const firstAdmin = [{
      email: "admin@domain.com",
      password: hashPassword("admin123"),
      role: "admin",
      profileCompleted: true
    }];
    localStorage.setItem("users", JSON.stringify(firstAdmin));
  }

  // ---- Registration ----
  const registerForm = document.getElementById("registerform");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email-input").value.trim();
      const password = document.getElementById("password-input").value;
      const repeatPassword = document.getElementById("repeat-password-input").value;
      const role = document.getElementById("role").value;

      if (!email || !password || !repeatPassword) {
        alert("Please fill all fields.");
        return;
      }

      if (password !== repeatPassword) {
        alert("Passwords do not match!");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.find(u => u.email === email)) {
        alert("Email already exists!");
        return;
      }

      const newUser = {
        email: email,
        password: hashPassword(password),
        role: role,
        profileCompleted: role === "admin" ? true : false // volunteers need profile
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      if (role === "volunteer") {
        localStorage.setItem("currentUser", email);
        window.location.href = "../UserProfile/userprofile.html"; // redirect to profile page
      } else {
        window.location.href = "../Admin/admindashboard/Admindash.html"; // admin dashboard
      }
    });
  }

  // ---- Login ----
  const loginForm = document.getElementById("loginform");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginemail").value.trim();
      const password = document.getElementById("loginpassword").value;
      const role = document.getElementById("loginrole").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email && u.role === role);

      if (!user) {
        alert("Invalid credentials or role!");
        return;
      }

      if (user.password !== hashPassword(password)) {
        alert("Incorrect password!");
        return;
      }

      localStorage.setItem("currentUser", email);

      if (role === "volunteer") {
        if (!user.profileCompleted) {
          window.location.href = "../UserProfile/userprofile.html"; // complete profile
        } else {
          window.location.href = "../VolunteerDashboard/volunteerdashboard.html"; // dashboard
        }
      } else if (role === "admin") {
        window.location.href = "../Admin/admindashboard/Admindash.html";
      }
    });
  }
});
