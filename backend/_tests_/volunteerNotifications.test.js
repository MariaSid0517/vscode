const db = require("../db");
const { loadNotifications, markAsRead } = require("../Volunteer/notifications");

jest.mock("../db", () => ({
  query: jest.fn()
}));

describe("Volunteer Notifications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads notifications successfully", async () => {
    const mockData = [
      { id: 1, type: "Reminder", message: "Event tomorrow", date_sent: "2025-10-31", is_read: 0 },
      { id: 2, type: "Update", message: "Schedule changed", date_sent: "2025-10-30", is_read: 1 }
    ];
    db.query.mockResolvedValue([mockData]);

    const notifications = await loadNotifications(1);
    expect(notifications).toEqual(mockData);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("FROM notifications"),
      [1]
    );
  });

  test("returns empty array on DB error", async () => {
    db.query.mockRejectedValue(new Error("DB failure"));
    const notifications = await loadNotifications(1);
    expect(notifications).toEqual([]);
  });

  test("markAsRead updates notification successfully", async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const result = await markAsRead(1);
    expect(result).toBe(true);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE notifications"),
      [1]
    );
  });

  test("markAsRead fails on DB error", async () => {
    db.query.mockRejectedValue(new Error("DB failure"));
    const result = await markAsRead(1);
    expect(result).toBe(false);
  });
});
