/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

global.fetch = require("jest-fetch-mock");

beforeEach(() => {
  const html = `<div id="notificationsList"></div>`;
  document.body.innerHTML = html;

  fetch.resetMocks();
  fetch.mockResponseOnce(JSON.stringify([
    { id: 1, type: "Event Assignment", message: "You have been assigned", date_sent: "2025-10-10", read: false },
    { id: 2, type: "Reminder", message: "Don't forget", date_sent: "2025-10-11", read: false },
    { id: 3, type: "Schedule Update", message: "New schedule", date_sent: "2025-10-12", read: true }
  ]));

  const scriptPath = path.resolve("./Volunteer/notifications.js");
  const script = fs.readFileSync(scriptPath, "utf8");
  eval(script);

  document.dispatchEvent(new Event("DOMContentLoaded"));
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
  btn.click();

  const unread = document.querySelectorAll(".notification-card.unread");
  expect(unread.length).toBe(1);
});
