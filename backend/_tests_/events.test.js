/**
 * @jest-environment jsdom
 */

const { validateEvent, attachEventFormListener } = require("../Admin/event");

beforeEach(() => {
  // Set up DOM
  document.body.innerHTML = `
    <form id="eventForm">
      <input type="text" id="name" />
      <textarea id="description"></textarea>
      <input type="date" id="date" />
      <input type="text" id="location" />
      <select id="state"></select>
      <input type="number" id="max_volunteers" />
      <input type="text" id="required_skills" />
      <select id="urgency">
        <option value=""></option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  `;

  // Mock global alert and fetch
  global.alert = jest.fn();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Event validation", () => {
  test("valid event returns no errors", () => {
    const event = {
      name: "Food Drive",
      description: "Collecting food",
      location: "Community Center",
      date: "2025-11-10",
      max_volunteers: 25
    };

    const errors = validateEvent(event);
    expect(errors).toHaveLength(0);
  });

  test("invalid types return errors", () => {
    const event = {
      name: 123,
      description: 456,
      location: 789,
      date: "invalid-date",
      max_volunteers: "not-a-number"
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Event name must be a string.");
    expect(errors).toContain("Description must be a string.");
    expect(errors).toContain("Location must be a string.");
    expect(errors).toContain("Event date must be valid.");
    expect(errors).toContain("Max volunteers must be a number.");
    expect(errors).toContain("Event name is required.");
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("Location is required.");
    expect(errors).toContain("Event date is required or invalid.");
  });
});

describe("Event form DOM interactions", () => {
  test("submits valid event data", async () => {
    const form = document.getElementById("eventForm");
    document.getElementById("name").value = "Food Drive";
    document.getElementById("description").value = "Collecting food";
    document.getElementById("date").value = "2025-11-10";
    document.getElementById("location").value = "Community Center";
    document.getElementById("state").value = "";
    document.getElementById("max_volunteers").value = 25;
    document.getElementById("required_skills").value = "";
    document.getElementById("urgency").value = "";

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    attachEventFormListener();

    // Dispatch submit
    await form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/events",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Food Drive",
          description: "Collecting food",
          date: "2025-11-10",
          location: "Community Center",
          state_id: null,
          max_volunteers: 25,
          required_skills: "",
          urgency: ""
        })
      })
    );

    expect(global.alert).toHaveBeenCalledWith(" Event added successfully!");
  });

  test("alerts on fetch failure", async () => {
    const form = document.getElementById("eventForm");
    attachEventFormListener();

    fetch.mockRejectedValueOnce(new Error("Network Error"));

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    // Wait for promises to resolve
    await new Promise((r) => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith(" Could not connect to backend.");
  });

  test("alerts if required fields are missing", async () => {
    const form = document.getElementById("eventForm");
    attachEventFormListener();

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalled();
    const alertMsg = global.alert.mock.calls[0][0];
    expect(alertMsg).toMatch(/Error|required/);
  });
});
