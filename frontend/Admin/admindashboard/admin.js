function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

// Load stored data
let events = JSON.parse(localStorage.getItem("events")) || [];
let matches = JSON.parse(localStorage.getItem("matches")) || [];
let volunteers = JSON.parse(localStorage.getItem("volunteers")) || []; // pretend this comes from DB

// Dummy volunteers if none exist
if (volunteers.length === 0) {
  volunteers = [
    { name: "Maria Siddeeque", skills: ["teaching"], id: 1 },
    { name: "Madeeha Siddeeque", skills: ["coding", "logistics"], id: 2 }
  ];
  localStorage.setItem("volunteers", JSON.stringify(volunteers));
}

// Event creation
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const event = {
      id: Date.now(),
      name: document.getElementById("eventName").value,
      description: document.getElementById("eventDescription").value,
      location: document.getElementById("eventLocation").value,
      skills: Array.from(document.getElementById("eventSkills").selectedOptions).map(o => o.value),
      urgency: document.getElementById("eventUrgency").value,
      date: document.getElementById("eventDate").value
    };

    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    alert("Event created!");
    renderEvents();
    renderEventOptions();
    eventForm.reset();
  });
}

// Render events list
function renderEvents() {
  const eventList = document.getElementById("eventList");
  if (!eventList) return;
  eventList.innerHTML = "";
  events.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `${ev.name} - ${ev.date} (${ev.urgency})`;
    eventList.appendChild(li);
  });
}
renderEvents();

// Populate event options in matching form
function renderEventOptions() {
  const eventSelect = document.getElementById("matchedEvent");
  if (!eventSelect) return;
  eventSelect.innerHTML = "";
  events.forEach(ev => {
    const opt = document.createElement("option");
    opt.value = ev.id;
    opt.textContent = ev.name;
    eventSelect.appendChild(opt);
  });
}
renderEventOptions();

// Populate volunteer options
function renderVolunteerOptions() {
  const volSelect = document.getElementById("volunteerName");
  if (!volSelect) return;
  volSelect.innerHTML = "";
  volunteers.forEach(vol => {
    const opt = document.createElement("option");
    opt.value = vol.id;
    opt.textContent = vol.name;
    volSelect.appendChild(opt);
  });
}
renderVolunteerOptions();

// Handle volunteer matching
const matchingForm = document.getElementById("matchingForm");
if (matchingForm) {
  matchingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const volId = parseInt(document.getElementById("volunteerName").value);
    const eventId = parseInt(document.getElementById("matchedEvent").value);

    const vol = volunteers.find(v => v.id === volId);
    const ev = events.find(e => e.id === eventId);

    const match = {
      volunteer: vol.name,
      event: ev.name,
      description: ev.description,
      location: ev.location,
      skills: ev.skills.join(", "),
      urgency: ev.urgency,
      date: ev.date,
      status: "Completed"
    };

    matches.push(match);
    localStorage.setItem("matches", JSON.stringify(matches));

    alert(`Matched ${vol.name} to ${ev.name}!`);
    renderMatches();
    renderHistory();
  });
}

// Render matches list
function renderMatches() {
  const matchList = document.getElementById("matchList");
  if (!matchList) return;
  matchList.innerHTML = "";
  matches.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.volunteer} → ${m.event}`;
    matchList.appendChild(li);
  });
}
renderMatches();

// Render volunteer history table
function renderHistory() {
  const table = document.getElementById("historyTable");
  if (!table) return;
  table.innerHTML = "";
  matches.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.volunteer}</td>
      <td>${m.event}</td>
      <td>${m.description}</td>
      <td>${m.location}</td>
      <td>${m.skills}</td>
      <td>${m.urgency}</td>
      <td>${m.date}</td>
      <td>${m.status}</td>
    `;
    table.appendChild(row);
  });
}
renderHistory();