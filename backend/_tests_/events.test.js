/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { validateEvent } = require("../Admin/event.js");

describe("Event validation", () => {
  test("returns type validation errors when incorrect types are provided", () => {
    const event = {
      name: 123,
      description: {},
      location: [],
      date: "invalid-date",
      max_volunteers: "abc"
    };

    const errors = validateEvent(event);

    expect(errors).toContain("Event name must be a string.");
    expect(errors).toContain("Description must be a string.");
    expect(errors).toContain("Location must be a string.");
    expect(errors).toContain("Event date must be valid.");
    expect(errors).toContain("Max volunteers must be a number.");
  });

  test("returns required field errors when missing", () => {
    const event = {};
    const errors = validateEvent(event);

    expect(errors).toContain("Event name is required.");
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("Location is required.");
    expect(errors).toContain("Event date is required or invalid.");
  });

  test("returns length validation errors when too long", () => {
    const event = {
      name: "a".repeat(151),
      description: "b".repeat(1001),
      location: "c".repeat(256),
      date: "2025-11-05",
      max_volunteers: 10
    };

    const errors = validateEvent(event);

    expect(errors).toContain("Event name cannot exceed 150 characters.");
    expect(errors).toContain("Description cannot exceed 1000 characters.");
    expect(errors).toContain("Location cannot exceed 255 characters.");
  });
});

describe("Event form DOM interactions", () => {
  let form;
  let nameInput, descInput, dateInput, locationInput, maxVolInput;

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/Admin/Event/EventForm.html"),
      "utf8"
    );
    document.body.innerHTML = html;

    form = document.getElementById("eventForm");
    nameInput = document.getElementById("name");
    descInput = document.getElementById("description");
    dateInput = document.getElementById("date");
    locationInput = document.getElementById("location");
    maxVolInput = document.getElementById("max_volunteers");

    // Mock fetch and alert
    global.fetch = jest.fn();
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("submits valid event data", async () => {
    nameInput.value = "Food Drive";
    descInput.value = "Collecting food for families";
    dateInput.value = "2025-11-10";
    locationInput.value = "Community Center";
    maxVolInput.value = "25";

    // Attach form listener manually
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const eventData = {
        name: nameInput.value.trim(),
        description: descInput.value.trim(),
        date: dateInput.value,
        location: locationInput.value.trim(),
        state_id: null,
        max_volunteers: parseInt(maxVolInput.value) || null,
        required_skills: "",
        urgency: ""
      };

      await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData)
      });

      alert(" Event added successfully!");
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    form.dispatchEvent(new Event("submit"));

    await new Promise(r => setTimeout(r, 0)); // wait async

    expect(fetch).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith(" Event added successfully!");
  });

  test("alerts if required fields are missing", async () => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      alert("Please fill required fields");
    });

    form.dispatchEvent(new Event("submit"));

    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalled();
    expect(global.alert.mock.calls[0][0]).toMatch(/required/i);
  });

  test("alerts on fetch failure", async () => {
    nameInput.value = "Test Event";
    descInput.value = "Some description";
    dateInput.value = "2025-11-10";
    locationInput.value = "Community Center";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await fetch("http://localhost:3000/events");
      } catch (err) {
        alert(" Could not connect to backend.");
      }
    });

    fetch.mockRejectedValueOnce(new Error("Network Error"));

    form.dispatchEvent(new Event("submit"));

    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith(" Could not connect to backend.");
  });
});
