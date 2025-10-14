// Hardcoded data
const volunteers = [
  { id: 1, name: "Maria Siddeeque", skills: ["Organization", "Public Speaking"] },
  { id: 2, name: "Matthew Reyna", skills: ["Logistics", "Event Setup"] },
  { id: 3, name: "Madeeha Siddeeque", skills: ["Fundraising", "Communication"] }
];

const events = [
  { id: 1, name: "Mental Health Outreach", requiredSkills: ["Public Speaking"] },
  { id: 2, name: "Health Clinic", requiredSkills: ["Organization", "Medical Support"] },
  { id: 3, name: "Fundraiser Gala", requiredSkills: ["Fundraising", "Communication"] }
];

// Store matches
let matches = [];

// Main function to initialize the form
function initMatchForm() {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchList = document.getElementById("matchList");
  const matchingForm = document.getElementById("matchingForm");

  // Populate dropdowns
  volunteers.forEach(v => {
    const option = document.createElement("option");
    option.value = v.id;
    option.textContent = v.name;
    volunteerSelect.appendChild(option);
  });

  events.forEach(e => {
    const option = document.createElement("option");
    option.value = e.id;
    option.textContent = e.name;
    eventSelect.appendChild(option);
  });

  // Handle form submission
  matchingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const volunteerId = parseInt(volunteerSelect.value);
    const eventId = parseInt(eventSelect.value);

    // Validation
    if (!volunteerId || !eventId) {
      alert("Please select both a volunteer and an event.");
      return;
    }

    const volunteer = volunteers.find(v => v.id === volunteerId);
    const event = events.find(ev => ev.id === eventId);

    if (!volunteer || !event) {
      alert("Selected volunteer or event does not exist.");
      return;
    }

    if (matches.some(m => m.volunteer.id === volunteerId && m.event.id === eventId)) {
      alert("This volunteer is already matched to that event!");
      return;
    }

    // Skill check
    const missingSkills = event.requiredSkills.filter(skill => !volunteer.skills.includes(skill));
    if (missingSkills.length > 0) {
      const proceed = confirm(
        `Warning: This volunteer is missing the following required skills for this event: ${missingSkills.join(", ")}. Do you still want to match them?`
      );
      if (!proceed) return;
    }

    // Add match
    const match = { volunteer, event };
    matches.push(match);
    updateMatchList();
    matchingForm.reset();
  });

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

  // Initial display
  updateMatchList();
}

// Export for testing
if (typeof module !== "undefined") {
  module.exports = { initMatchForm, volunteers, events, matches };
}
