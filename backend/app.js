// backend/app.js
import { loadNavbar } from './Navbar/loadNavbar.js';

const API = {
  getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
  },

  saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
  },

  getVolunteers() {
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    if (volunteers.length === 0) {
      volunteers = [
        { name: "Maria Siddeeque", skills: ["teaching"], id: 1 },
        { name: "Madeeha Siddeeque", skills: ["coding", "logistics"], id: 2 }
      ];
      localStorage.setItem("volunteers", JSON.stringify(volunteers));
    }
    return volunteers;
  },

  saveVolunteers(volunteers) {
    localStorage.setItem("volunteers", JSON.stringify(volunteers));
  },

  getMatches() {
    return JSON.parse(localStorage.getItem("matches")) || [];
  },

  saveMatches(matches) {
    localStorage.setItem("matches", JSON.stringify(matches));
  }
};

// Load navbar when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});

export default API;
