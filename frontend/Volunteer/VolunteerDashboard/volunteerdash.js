let events = JSON.parse(localStorage.getItem("events")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// Mock logged-in user (in real system, this comes from login/registration)
let currentUser = localStorage.getItem("currentUser") || "Alice";

// Save helper
function saveData() {
  localStorage.setItem("history", JSON.stringify(history));
}

// -------------------- VOLUNTEER FEATURES -------------------- //
// Show Available Events
function updateEventListVolunteer() {
  const list = document.getElementById("eventListVolunteer");
  if (!list) return;
  list.innerHTML = events.length === 0 
    ? "<p>No events available right now.</p>"
    : events.map(ev =>
      `<div class="event-card">
        <h4>${ev.name}</h4>
        <p>${ev.description}</p>
        <p><b>Location:</b> ${ev.location}</p>
        <p><b>Skills:</b> ${ev.skills.join(", ")}</p>
        <p><b>Urgency:</b> ${ev.urgency}</p>
        <p><b>Date:</b> ${ev.date}</p>
        <button onclick="signUp('${ev.name}')">Sign Up</button>
      </div>`
    ).join("");
}

// Volunteer signs up for an event
function signUp(eventName) {
  const event = events.find(ev => ev.name === eventName);

  // Check if already signed up
  const already = history.find(h => h.volunteer === currentUser && h.name === eventName);
  if (already) {
    alert(`You are already signed up for ${eventName}.`);
    return;
  }

  history.push({
    volunteer: currentUser,
    ...event,
    status: "Signed Up"
  });

  saveData();
  alert(`You signed up for ${eventName}!`);
  updateMyHistoryTable();
}

// Show Volunteer’s Own History
function updateMyHistoryTable() {
  const tbody = document.getElementById("myHistoryTable");
  if (!tbody) return;
  const myHistory = history.filter(h => h.volunteer === currentUser);
  tbody.innerHTML = myHistory.length === 0
    ? "<tr><td colspan='7'>No history yet.</td></tr>"
    : myHistory.map(h =>
      `<tr>
        <td>${h.name}</td>
        <td>${h.description}</td>
        <td>${h.location}</td>
        <td>${h.skills.join(", ")}</td>
        <td>${h.urgency}</td>
        <td>${h.date}</td>
        <td>${h.status}</td>
      </tr>`
    ).join("");
}

// -------------------- INIT -------------------- //
updateEventListVolunteer();
updateMyHistoryTable();