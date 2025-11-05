document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginform");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginemail").value.trim();
    const password = document.getElementById("loginpassword").value.trim();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);

      if (data.role === "volunteer") {
        window.location.href = "../Volunteer/UserProfile/userprofile.html";
      } else if (data.role === "admin") {
        window.location.href = "../Admin/Event/EventForm.html";
      } else {
        alert("Unknown role.");
      }
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });
});
