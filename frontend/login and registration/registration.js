document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerform");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("password-input").value.trim();
    const confirmPassword = document
      .getElementById("repeat-password-input")
      .value.trim();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // NOTE: Do the password HASHING on the backend
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      alert("Registration successful! Please log in.");
      // Adjust this path if your login page is in a different folder
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message || "Something went wrong.");
      console.error(err);
    }
  });
});
