/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

// Adjust this path based on your folder structure
const htmlPath = path.resolve(__dirname, "../../frontend/Admin/adminvolunteerhistory/adminhistory.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("Admin Volunteer History Page", () => {
  let historyScript;

  beforeEach(() => {
    document.documentElement.innerHTML = html;

    // Mock fetch
    global.fetch = jest.fn();

    // Clear previous module cache (important for re-require)
    jest.resetModules();

    // Load the script (CommonJS)
    historyScript = require("../Admin/VolunteerHistory.js");
  });

  test("Displays 'No volunteer history found' when API returns empty list", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });

    document.dispatchEvent(new Event("DOMContentLoaded"));

    // Wait for async fetch + DOM update
    await new Promise(process.nextTick);

    const body = document.getElementById("historyBody");
    expect(body.textContent).toContain("No volunteer history found");
  });

  test("Renders rows when records are returned", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          volunteer_name: "Aisha",
          event_name: "Food Drive",
          event_date: "2025-10-01",
          location: "Houston",
          required_skills: "Packing",
          urgency: "High",
          status: "completed",
        }
      ]),
    });

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const rows = document.querySelectorAll("#historyBody tr");
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain("Aisha");
    expect(rows[0].textContent).toContain("Food Drive");
  });

  test("Displays error message when server returns failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(process.nextTick);

    const body = document.getElementById("historyBody");
    expect(body.textContent).toContain("Error");
  });
});
