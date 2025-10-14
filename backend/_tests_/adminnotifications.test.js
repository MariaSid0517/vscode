const { notifications, validateNotification, addNotification } = require("../Admin/notifications.js");

describe("Admin Notifications", () => {
  test("initial notifications are displayed", () => {
    expect(notifications.length).toBe(2);
  });

  test("validation fails if fields are empty", () => {
    const result = validateNotification({ volunteer: "", type: "", message: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  test("validation fails if volunteer name too long", () => {
    const result = validateNotification({
      volunteer: "A".repeat(51),
      type: "Reminder",
      message: "Test message"
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Volunteer name too long.");
  });

  test("validation fails if type too long", () => {
    const result = validateNotification({
      volunteer: "Maria",
      type: "A".repeat(31),
      message: "Test message"
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Type too long.");
  });

  test("validation fails if message too long", () => {
    const result = validateNotification({
      volunteer: "Maria",
      type: "Reminder",
      message: "A".repeat(501)
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Message too long.");
  });

  test("validation passes with correct input", () => {
    const result = validateNotification({
      volunteer: "Maria",
      type: "Reminder",
      message: "Test message"
    });
    expect(result.valid).toBe(true);
  });

  test("can add a new notification", () => {
    const result = addNotification({ volunteer: "Matthew", type: "Update", message: "Event moved" });
    expect(result.valid).toBe(true);
    expect(notifications.length).toBe(3);
    expect(notifications[2].volunteer).toBe("Matthew");
  });

  test("cannot add invalid notification", () => {
    const result = addNotification({ volunteer: "", type: "", message: "" });
    expect(result.valid).toBe(false);
    expect(notifications.length).toBe(3); // unchanged
  });
});