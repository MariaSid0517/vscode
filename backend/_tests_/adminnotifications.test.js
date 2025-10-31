/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

global.fetch = require("jest-fetch-mock");

function loadNotificationsScriptIntoPage() {
  const file = path.resolve(__dirname, "../Admin/notifications.js");
  let js = fs.readFileSync(file, "utf8");

  // Strip trailing ESM export so eval doesn't choke
  js = js.replace(/^\s*export\s*\{[^}]+\};?\s*$/m, "");

  // expose to window if present
  js += `
    if (typeof loadVolunteers === 'function') window.loadVolunteers = loadVolunteers;
    if (typeof sendNotification === 'function') window.sendNotification = sendNotification;
  `;

  // eslint-disable-next-line no-eval
  eval(js);
}

beforeEach(() => {
  const filePath = path.resolve(
    __dirname,
    "../../frontend/Admin/Notification/Notification.html"
  );
  const html = fs.readFileSync(filePath, "utf8");
  document.documentElement.innerHTML = html;

  fetch.resetMocks();
  window.fetch = global.fetch;

  loadNotificationsScriptIntoPage();
});

test("loads volunteers into dropdown", async () => {
  fetch.mockResponseOnce(
    JSON.stringify([
      { id: 1, name: "Maria Siddeeque" },
      { id: 2, name: "Matthew Reyna" },
    ])
  );

  await window.loadVolunteers();

  const select = document.getElementById("volunteer");
  expect(select).not.toBeNull();

  const options = select.options;
  expect(options.length).toBe(3); // default + 2
  expect(options[1].textContent).toBe("Maria Siddeeque");
  expect(options[2].textContent).toBe("Matthew Reyna");
});

test("sends notification to single volunteer", async () => {
  // 1) load volunteers (GET /volunteers or similar)
  fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: "Maria" }]));
  await window.loadVolunteers();

  // Fill form fields like the UI would
  document.getElementById("volunteer").value = "1";
  document.getElementById("notificationType").value = "Reminder";
  document.getElementById("message").value = "Test message";

  // 2) endpoint for send (POST /notifications/send)
  fetch.mockResponseOnce(JSON.stringify({ success: true }));

  // Call function directly with a minimal event that has preventDefault
  await window.sendNotification({ preventDefault: () => {} });

  // Assert a POST to /notifications/send with the right body occurred
  const calledSend = fetch.mock.calls.some(([url, init]) => {
    return (
      url === "/notifications/send" &&
      init &&
      init.method === "POST" &&
      !!init.headers &&
      init.body ===
        JSON.stringify({
          volunteer_id: 1,
          type: "Reminder",
          message: "Test message",
        })
    );
  });

  expect(calledSend).toBe(true);
});
