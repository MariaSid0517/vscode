let volunteers = [];
let events = [];
let matches = [];

const API = "http://localhost:3000/match";

function initMatchForm() {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchList = document.getElementById("matchList");
  const matchingForm = document.getElementById("matchingForm");

  if (!volunteerSelect || !eventSelect || !matchList || !matchingForm) {
    console.error("Match form elements not found.");
    return;
  }

  fetch(`${API}/volunteers`)
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

  fetch(`${API}/events`)
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

  fetch(`${API}/list`)
    .then(res => res.json())
    .then(data => {
      matches = data;
      updateMatchList();
    })
    .catch(err => console.error("Error loading existing matches:", err));

  matchingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const volunteerId = parseInt(volunteerSelect.value, 10);
    const eventId = parseInt(eventSelect.value, 10);

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

    const missingSkills = (event.required_skills || []).filter(
      s => !(volunteer.skills || []).includes(s)
    );
    if (missingSkills.length > 0) {
      const go = confirm(
        `Volunteer is missing required skills: ${missingSkills.join(", ")}.\nProceed anyway?`
      );
      if (!go) return;
    }

    fetch(`${API}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteer_id: volunteerId, event_id: eventId })
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text;
      })
      .then(() => {
        matches.unshift({ volunteer, event });
        updateMatchList();
        matchingForm.reset();
        volunteerSelect.focus();
      })
      .catch(err => {
        alert(err.message || "Error assigning match");
        console.error("Error assigning match:", err);
      });
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
}

document.addEventListener("DOMContentLoaded", initMatchForm);
