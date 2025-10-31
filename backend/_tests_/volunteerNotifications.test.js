/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

global.fetch = require("jest-fetch-mock");

function loadVolunteerNotificationsScriptIntoPage() {
  const scriptPath = path.resolve(__dirname, "../Volunteer/notifications.js");
  const js = fs.readFileSync(scriptPath, "utf8");
  // eslint-disable-next-line no-eval
  eval(js);
}

beforeEach(async () => {
  document.body.innerHTML = `<div id="notificationsList"></div>`;

  fetch.resetMocks();

  const notifications = [
    {
      id: 1,
      type: "Event Assignment",
      message: "You have been assigned",
      date_sent: "2025-10-10",
      read: false,
    },
    {
      id: 2,
      type: "Reminder",
      message: "Don't forget",
      date_sent: "2025-10-11",
      read: false,
    },
    {
      id: 3,
      type: "Schedule Update",
      message: "New schedule",
      date_sent: "2025-10-12",
      read: true,
    },
  ];

  // Default implementation: first GET returns notifications; any write returns {success:true}
  fetch.mockImplementation((url, opts = {}) => {
    const method = (opts.method || "GET").toUpperCase();
    if (method === "GET") {
      return Promise.resolve({
        ok: true,
        json: async () => notifications,
      });
    }
    // PUT/PATCH/POST -> success
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  window.fetch = global.fetch;

  loadVolunteerNotificationsScriptIntoPage();

  document.dispatchEvent(new Event("DOMContentLoaded"));

  // allow render to finish
  await new Promise((r) => setTimeout(r, 20));
});

test("renders all notifications correctly", () => {
  const cards = document.querySelectorAll(".notification-card");
  expect(cards.length).toBe(3);

  const unread = document.querySelectorAll(".notification-card.unread");
  expect(unread.length).toBe(2);
});

test("unread notifications have 'Mark as Read' button", () => {
  const btn = document.querySelector(".mark-read-btn");
  expect(btn).not.toBeNull();
  expect(btn.textContent).toBe("Mark as Read");
});

test("clicking mark as read updates the notification", async () => {
  const btn = document.querySelector(".mark-read-btn");
  expect(btn).not.toBeNull();

  btn.click();

  await new Promise((r) => setTimeout(r, 20));

  const unread = document.querySelectorAll(".notification-card.unread");
  expect(unread.length).toBe(1);
});
