document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  const currentUserEmail = localStorage.getItem("currentUser");


  // Handle adding multiple availability dates
  window.addDate = function () {
    const container = document.getElementById("availability-container");
    const newInput = document.createElement("input");
    newInput.type = "date";
    newInput.name = "availability[]";
    newInput.required = true;
    container.appendChild(newInput);
  };

  // Load user data if already filled before
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === currentUserEmail);

  if (user && user.profile) {
    const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = user.profile;

    document.getElementById("fullName").value = fullName || "";
    document.getElementById("address1").value = address1 || "";
    document.getElementById("address2").value = address2 || "";
    document.getElementById("city").value = city || "";
    document.getElementById("state").value = state || "";
    document.getElementById("zip").value = zip || "";
    document.getElementById("preferences").value = preferences || "";

    if (skills && skills.length) {
      const skillOptions = document.getElementById("skills").options;
      for (let i = 0; i < skillOptions.length; i++) {
        if (skills.includes(skillOptions[i].value)) {
          skillOptions[i].selected = true;
        }
      }
    }

    if (availability && availability.length) {
      const container = document.getElementById("availability-container");
      container.innerHTML = "";
      availability.forEach(date => {
        const input = document.createElement("input");
        input.type = "date";
        input.name = "availability[]";
        input.value = date;
        container.appendChild(input);
      });
    }
  }

  // Save profile data
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const address2 = document.getElementById("address2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const preferences = document.getElementById("preferences").value.trim();
    const selectedSkills = Array.from(document.getElementById("skills").selectedOptions).map(opt => opt.value);
    const availabilityDates = Array.from(document.querySelectorAll("#availability-container input")).map(i => i.value);

    if (!fullName || !address1 || !city || !state || !zip || selectedSkills.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === currentUserEmail);

    if (userIndex === -1) {
      alert("User not found.");
      return;
    }

    users[userIndex].profile = {
      fullName,
      address1,
      address2,
      city,
      state,
      zip,
      skills: selectedSkills,
      preferences,
      availability: availabilityDates
    };

    users[userIndex].profileCompleted = true;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Profile saved successfully!");
    window.location.href = "../VolunteerDashboard/volunteerdashboard.html";
  });
});

