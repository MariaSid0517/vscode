document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");

  // Load from "database" (localStorage)
  let events = JSON.parse(localStorage.getItem("events")) || [];

  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
  }

  function displayEvents() {
    eventList.innerHTML = "";
    if (events.length === 0) {
      eventList.innerHTML = "<li>No events created yet.</li>";
      return;
    }

    events.forEach((event, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${event.name}</strong> - ${event.date} <br>
        <em>${event.description}</em><br>
        <b>Location:</b> ${event.location}<br>
        <b>Urgency:</b> ${event.urgency}<br>
        <b>Skills:</b> ${event.skills.join(", ")}<br>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      eventList.appendChild(li);
    });
  }

  // Handle Form Submit
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const eventName = document.getElementById("eventName").value.trim();
    const eventDescription = document.getElementById("eventDescription").value.trim();
    const eventLocation = document.getElementById("eventLocation").value.trim();
    const requiredSkills = Array.from(document.getElementById("requiredSkills").selectedOptions).map(opt => opt.value);
    const urgency = document.getElementById("urgency").value;
    const eventDate = document.getElementById("eventDate").value;

    if (!eventName || !eventDescription || !eventLocation || requiredSkills.length === 0 || !urgency || !eventDate) {
      alert("Please fill out all fields.");
      return;
    }

    const newEvent = {
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      skills: requiredSkills,
      urgency: urgency,
      date: eventDate
    };

    events.push(newEvent);
    saveEvents();
    displayEvents();
    eventForm.reset();
  });

  // Edit & Delete Buttons
  eventList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this event?")) {
        events.splice(index, 1);
        saveEvents();
        displayEvents();
      }
    } else if (e.target.classList.contains("edit-btn")) {
      const ev = events[index];
      document.getElementById("eventName").value = ev.name;
      document.getElementById("eventDescription").value = ev.description;
      document.getElementById("eventLocation").value = ev.location;
      document.getElementById("urgency").value = ev.urgency;
      document.getElementById("eventDate").value = ev.date;

      // Select multiple skills
      const skillOptions = document.getElementById("requiredSkills").options;
      for (let option of skillOptions) {
        option.selected = ev.skills.includes(option.value);
      }

      // Remove & resave after editing
      events.splice(index, 1);
      saveEvents();
      displayEvents();
    }
  });

  // Initial Display
  displayEvents();
});
