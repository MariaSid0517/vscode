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

document.addEventListener("DOMContentLoaded", () => {
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

  // Form submission
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

    // Check if already matched
    if (matches.some(m => m.volunteer.id === volunteerId && m.event.id === eventId)) {
      alert("This volunteer is already matched to that event!");
      return;
    }

    // Add match
    const match = { volunteer, event };
    matches.push(match);
    updateMatchList();
  });

  function updateMatchList() {
    matchList.innerHTML = "";
    matches.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `${m.volunteer.name} → ${m.event.name}`;
      matchList.appendChild(li);
    });
  }
});
