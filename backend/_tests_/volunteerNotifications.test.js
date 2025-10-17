/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Volunteer/notifications.js");
  scriptContent = fs.readFileSync(filePath, "utf8");
});

beforeEach(() => {
  document.body.innerHTML = `<div id="notificationsList"></div>`;

  // Load the notifications script
  eval(scriptContent);

  // Trigger DOMContentLoaded manually
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Volunteer Notifications", () => {
  test("renders all notifications correctly", () => {
    const cards = document.querySelectorAll(".notification-card");
    expect(cards.length).toBe(3);

    const unread = document.querySelectorAll(".notification-card.unread");
    expect(unread.length).toBe(2);
  });

  test("unread notifications have 'Mark as Read' button", () => {
    const buttons = document.querySelectorAll(".mark-read-btn");
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe("Mark as Read");
  });

  test("clicking mark as read updates the notification", () => {
    const firstButton = document.querySelector(".mark-read-btn");
    firstButton.click();
    const unread = document.querySelectorAll(".notification-card.unread");
    expect(unread.length).toBe(1);
  });
});
