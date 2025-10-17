/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Volunteer/volunteerdash.js");
  scriptContent = fs.readFileSync(filePath, "utf8");

  // Load the script once globally
  eval(scriptContent);
});

beforeEach(() => {
  // Reset DOM fresh before each test
  document.body.innerHTML = `
    <div id="total-events"></div>
    <div id="total-hours"></div>
    <div id="upcoming-events"></div>
    <table>
      <tbody id="event-history"></tbody>
    </table>
  `;

  // Manually dispatch DOMContentLoaded to trigger the existing listener
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Volunteer Dashboard", () => {
  test("renders volunteer stats correctly", () => {
    expect(document.getElementById("total-events").textContent).toBe("5");
    expect(document.getElementById("total-hours").textContent).toBe("42");
    expect(document.getElementById("upcoming-events").textContent).toBe("2");
  });

  test("renders all event history rows", () => {
    const rows = document.querySelectorAll("#event-history tr");
    expect(rows.length).toBe(3);
    expect(rows[0].innerHTML).toContain("Beach Cleanup");
    expect(rows[1].innerHTML).toContain("Food Drive");
    expect(rows[2].innerHTML).toContain("Community Fair");
  });
});
