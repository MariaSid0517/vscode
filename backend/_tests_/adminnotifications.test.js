/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

global.fetch = require("jest-fetch-mock");

beforeEach(() => {
  const html = fs.readFileSync(path.resolve("../../frontend/Admin/Notification/Notification.html"), "utf8");
  document.documentElement.innerHTML = html;
  fetch.resetMocks();
});

test("loads volunteers into dropdown", async () => {
  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, name: "Maria Siddeeque" },
    { id: 2, name: "Matthew Reyna" }
  ]));

  const { loadVolunteers } = require("../Admin/notifications.js");
  await loadVolunteers();

  const options = document.getElementById("volunteer").options;
  expect(options.length).toBe(3);
  expect(options[1].textContent).toBe("Maria Siddeeque");
  expect(options[2].textContent).toBe("Matthew Reyna");
});


test("sends notification to single volunteer", async () => {
  fetch
    .mockResolvedValueOnce({ json: async () => [{ id: 1, name: "Maria" }] }) // load volunteers
    .mockResolvedValueOnce({ json: async () => ({ success: true }) }); // send notification

  const { loadVolunteers } = await import("../Admin/notifications.js");
  await loadVolunteers();

  document.getElementById("volunteer").value = "1";
  document.getElementById("notificationType").value = "Reminder";
  document.getElementById("message").value = "Test message";

  const form = document.getElementById("notificationForm");
  form.dispatchEvent(new Event("submit"));

  await new Promise(process.nextTick); // allow async

  expect(fetch).toHaveBeenCalledWith(
    "/notifications/send",
    expect.objectContaining({
      method: "POST",
      headers: expect.any(Object),
      body: JSON.stringify({ volunteer_id: 1, type: "Reminder", message: "Test message" })
    })
  );
});
