/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Volunteer/Events/Event.js");
  scriptContent = fs.readFileSync(filePath, "utf8");
});

beforeEach(() => {
  document.body.innerHTML = `
    <table id="eventsTable"><tbody></tbody></table>
  `;
  localStorage.clear();
  eval(scriptContent);
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Volunteer Event Page", () => {
  test("shows login message if not logged in", async () => {
    await new Promise((r) => setTimeout(r, 0)); // wait for async
    const cell = document.querySelector("#eventsTable tbody td");
    expect(cell.textContent).toContain("Please log in");
  });

  test("renders no matched events if API returns empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
    localStorage.setItem("user_id", "1");
    await new Promise((r) => setTimeout(r, 0));
    const cell = document.querySelector("#eventsTable tbody td");
    expect(cell.textContent).toContain("No matched events");
  });

  test("renders events from API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { event: { name: "Beach Cleanup", date: "2025-11-01", location: "Beach", id: 1 }, matched_at: "2025-10-30T12:00:00Z" },
          ]),
      })
    );
    localStorage.setItem("user_id", "1");
    await new Promise((r) => setTimeout(r, 0));
    const row = document.querySelector("#eventsTable tbody tr");
    expect(row.innerHTML).toContain("Beach Cleanup");
  });
});
