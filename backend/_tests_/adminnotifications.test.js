/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

describe("Admin Notifications Page", () => {
  let dom;
  let form, volunteerSelect, typeSelect, messageInput;

  beforeEach(async () => {
    // Load HTML file into JSDOM
    const html = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/Admin/Notification/notifications.html"),
      "utf8"
    );
    document.documentElement.innerHTML = html;

    // Mock fetch globally
    global.fetch = jest.fn();

    // Mock alert
    global.alert = jest.fn();

    // Get form elements
    form = document.getElementById("notificationForm");
    volunteerSelect = document.getElementById("volunteer");
    typeSelect = document.getElementById("notificationType");
    messageInput = document.getElementById("message");

    // Mock volunteers fetch
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { volunteer_id: 1, first_name: "Alice", last_name: "Smith" },
            { volunteer_id: 2, first_name: "Bob", last_name: "Jones" },
          ]),
      })
    );

    // Load notifications.js (simulate DOMContentLoaded)
    require("../../frontend/Admin/Notification/notifications.js");

    // Wait for volunteers to load
    await new Promise((r) => setTimeout(r, 0));
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("loads volunteers into dropdown", () => {
    expect(volunteerSelect.options.length).toBe(3); // includes "-- All Volunteers --"
    expect(volunteerSelect.options[1].textContent).toBe("Alice Smith");
    expect(volunteerSelect.options[2].textContent).toBe("Bob Jones");
  });

  test("alerts if fields are missing on submit", async () => {
    // Leave fields empty
    volunteerSelect.value = "";
    typeSelect.value = "";
    messageInput.value = "";

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(global.alert).toHaveBeenCalledWith("Please fill all fields.");
  });

  test("sends notification successfully when all fields are valid", async () => {
    volunteerSelect.value = "1";
    typeSelect.value = "Reminder";
    messageInput.value = "Test message";

    // Mock fetch for sending notification
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
    );

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    await new Promise((r) => setTimeout(r, 0)); // wait for async

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/notifications/send",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id: 1, type: "Reminder", message: "Test message" }),
      })
    );
    expect(global.alert).toHaveBeenCalledWith("Notification sent!");
  });

  test("shows alert if fetch returns success=false", async () => {
    volunteerSelect.value = "1";
    typeSelect.value = "Reminder";
    messageInput.value = "Test message";

    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: false, message: "Failed" }) })
    );

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    await new Promise((r) => setTimeout(r, 0)); // wait for async

    expect(global.alert).toHaveBeenCalledWith("Failed: Failed");
  });

  test("shows alert on fetch failure", async () => {
    volunteerSelect.value = "1";
    typeSelect.value = "Reminder";
    messageInput.value = "Test message";

    fetch.mockImplementationOnce(() => Promise.reject("Server error"));

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    await new Promise((r) => setTimeout(r, 0)); // wait for async

    expect(global.alert).toHaveBeenCalledWith("Server error sending notification.");
  });
});
