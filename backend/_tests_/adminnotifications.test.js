// _tests_/adminnotifications.test.js
const db = require("../db");

// Mock the DB
jest.mock("../db", () => ({
  query: jest.fn(),
}));

const { loadVolunteers, sendNotification } = require("../Admin/notifications");

describe("Admin Notifications Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadVolunteers", () => {
    test("should load volunteers successfully", async () => {
      const mockVolunteers = [
        { id: 1, first_name: "Alice", last_name: "Smith" },
        { id: 2, first_name: "Bob", last_name: "Johnson" },
      ];
      db.query.mockResolvedValueOnce([mockVolunteers]);

      const volunteers = await loadVolunteers();
      expect(volunteers).toHaveLength(2);
      expect(volunteers[0].first_name).toBe("Alice");
      expect(db.query).toHaveBeenCalledWith(
        "SELECT id, first_name, last_name FROM volunteers ORDER BY first_name"
      );
    });

    test("should return empty array if DB fails", async () => {
      db.query.mockRejectedValueOnce(new Error("DB failure"));

      const volunteers = await loadVolunteers();
      expect(volunteers).toEqual([]);
    });
  });

  describe("sendNotification", () => {
    test("should send notification to single volunteer", async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await sendNotification({ volunteerId: 1, type: "Info", message: "Hello" });
      expect(result.success).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) VALUES (?, ?, ?, ?)",
        expect.any(Array)
      );
    });

    test("should send notification to all volunteers", async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 2 }]);

      const result = await sendNotification({ volunteerId: 0, type: "Alert", message: "System Update" });
      expect(result.success).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO notifications (volunteer_id, type, message, date_sent) SELECT id, ?, ?, ? FROM volunteers",
        expect.any(Array)
      );
    });

    test("should fail if type or message is missing", async () => {
      const result = await sendNotification({ volunteerId: 1, type: "", message: "" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Type and message are required/);
    });

    test("should return error if DB fails", async () => {
      db.query.mockRejectedValueOnce(new Error("DB failure"));
      const result = await sendNotification({ volunteerId: 1, type: "Info", message: "Hello" });
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/DB failure/);
    });
  });
});
