let volunteers = [];
let events = [];
let matches = []; // Local display of matches

function initMatchForm() {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchList = document.getElementById("matchList");
  const matchingForm = document.getElementById("matchingForm");

  if (!volunteerSelect || !eventSelect || !matchList || !matchingForm) {
    console.error("Match form elements not found.");
    return;
  }

  // --- Fetch volunteers ---
  fetch("http://localhost:3000/match/volunteers")
    .then(res => res.json())
    .then(data => {
      volunteers = data;
      volunteerSelect.innerHTML = "<option value=''>-- Select Volunteer --</option>";
      volunteers.forEach(v => {
        const option = document.createElement("option");
        option.value = v.id;
        option.textContent = v.name;
        volunteerSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading volunteers:", err));

  // --- Fetch events ---
  fetch("http://localhost:3000/match/events")
    .then(res => res.json())
    .then(data => {
      events = data;
      eventSelect.innerHTML = "<option value=''>-- Select Event --</option>";
      events.forEach(e => {
        const option = document.createElement("option");
        option.value = e.id;
        option.textContent = e.name;
        eventSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading events:", err));

  // --- Fetch existing matches ---
  fetch("http://localhost:3000/match/list")
    .then(res => res.json())
    .then(data => {
      matches = data;
      updateMatchList();
    })
    .catch(err => console.error("Error loading existing matches:", err));

  // --- Handle form submit ---
  matchingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const volunteerId = parseInt(volunteerSelect.value);
    const eventId = parseInt(eventSelect.value);

    if (!volunteerId || !eventId) {
      alert("Please select both a volunteer and an event.");
      return;
    }

    const volunteer = volunteers.find(v => v.id === volunteerId);
    const event = events.find(ev => ev.id === eventId);

    if (!volunteer || !event) {
      alert("Invalid volunteer or event selection.");
      return;
    }

    // Skill match check
    const missingSkills = event.required_skills.filter(skill => !volunteer.skills.includes(skill));
    if (missingSkills.length > 0) {
      const proceed = confirm(
        `Volunteer is missing required skills: ${missingSkills.join(", ")}.\nProceed anyway?`
      );
      if (!proceed) return;
    }

    // Send match to backend
    fetch("/match/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteer_id: volunteerId, event_id: eventId })
    })
    .then(res => res.text())
    .then(response => {
      if (response.includes("already")) {
        alert("This volunteer is already matched to this event.");
        return;
      }

      // Add locally to display
      matches.push({ volunteer, event });
      updateMatchList();
      matchingForm.reset();
      volunteerSelect.focus();
    })
    .catch(err => console.error("Error assigning match:", err));
  });

  // --- Function to display matches ---
  function updateMatchList() {
    matchList.innerHTML = "";
    if (matches.length === 0) {
      matchList.innerHTML = "<li>No matches yet.</li>";
      return;
    }
    matches.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `${m.volunteer.name} → ${m.event.name}`;
      matchList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", initMatchForm);
