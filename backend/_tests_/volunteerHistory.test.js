/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "../../frontend/Volunteer/volunteer history/history.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("Volunteer History Page", () => {

  beforeEach(() => {
    document.documentElement.innerHTML = html;

    // Clear module cache and mocks
    jest.resetModules();
    global.fetch = jest.fn();
    Storage.prototype.getItem = jest.fn();
  });

  test("Shows login message when no user_id in localStorage", async () => {
    Storage.prototype.getItem.mockReturnValue(null);

    require("../Volunteer/history.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const body = document.getElementById("historyBody");
    expect(body.textContent).toContain("Please log in to view your history.");
  });

  test("Shows 'No completed events yet' when API returns empty list", async () => {
    Storage.prototype.getItem.mockReturnValue("5");
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });

    require("../Volunteer/history.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const body = document.getElementById("historyBody");
    expect(body.textContent).toContain("No completed events yet.");
  });

  test("Renders event rows when data exists", async () => {
    Storage.prototype.getItem.mockReturnValue("5");
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          event_name: "Park Cleanup",
          event_description: "Help clean park",
          location: "Austin",
          required_skills: "None",
          urgency: "Low",
          event_date: "2025-10-10"
        }
      ])
    });

    require("../Volunteer/history.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const rows = document.querySelectorAll("#historyBody tr");
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain("Park Cleanup");
    expect(rows[0].textContent).toContain("Help clean park");
  });

  test("Displays error message if fetch throws", async () => {
    Storage.prototype.getItem.mockReturnValue("5");
    fetch.mockRejectedValueOnce(new Error("Network failed"));

    require("../Volunteer/history.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const body = document.getElementById("historyBody");
    expect(body.textContent).toContain("Error loading history");
  });
});
