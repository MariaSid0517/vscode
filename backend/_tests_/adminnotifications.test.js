/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Admin/notifications.js");
  scriptContent = fs.readFileSync(filePath, "utf8");
});

beforeEach(() => {
  document.body.innerHTML = `<div id="notificationsList"></div>`;

  // Load the notifications script
  eval(scriptContent);

  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Admin Notifications", () => {
  test("initial notifications are displayed", () => {
    const cards = document.querySelectorAll(".notification-card");
    expect(cards.length).toBe(2);
  });

  test("validation fails if fields are empty", () => {
    const result = validateNotification({ volunteer: "", type: "", message: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  test("can add a new notification", () => {
    const result = addNotification({ volunteer: "Matthew", type: "Update", message: "Event moved" });
    expect(result.valid).toBe(true);
    const cards = document.querySelectorAll(".notification-card");
    expect(cards.length).toBe(3);
  });
});
