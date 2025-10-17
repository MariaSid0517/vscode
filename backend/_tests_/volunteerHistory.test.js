/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

describe("Volunteer History Module", () => {
  let scriptContent;
  let historyBody;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../Volunteer/history.js");
    scriptContent = fs.readFileSync(filePath, "utf8");
  });

  beforeEach(() => {
    //  Fresh DOM each time
    document.body.innerHTML = `
      <table>
        <tbody id="historyBody"></tbody>
      </table>
    `;
    historyBody = document.getElementById("historyBody");

    localStorage.clear();
    jest.resetModules();

    // Load the Volunteer/history.js code into the DOM
    eval(scriptContent);
  });

  test("renders default matches when localStorage is empty", () => {
    document.dispatchEvent(new Event("DOMContentLoaded"));
    const rows = historyBody.querySelectorAll("tr");

    //  Expect the 4 default rows defined in history.js
    expect(rows.length).toBe(4);
    expect(rows[0].innerHTML).toContain("Community Cleanup");
    expect(rows[1].innerHTML).toContain("Food Bank Support");
    expect(rows[2].innerHTML).toContain("Senior Center Tech Help");
    expect(rows[3].innerHTML).toContain("Disaster Relief Drive");
  });

  test("renders custom matches from localStorage if provided", () => {
    const customMatches = [
      {
        volunteerName: "John Doe",
        eventName: "Custom Event",
        eventDate: "2025-11-11",
        location: "Test Center",
        skills: ["Testing"],
        urgency: "Low",
        status: "Completed",
      },
    ];
    localStorage.setItem("matches", JSON.stringify(customMatches));

    document.dispatchEvent(new Event("DOMContentLoaded"));
    const rows = historyBody.querySelectorAll("tr");

    //  Should show only the 1 match from localStorage
    expect(rows.length).toBe(1);
    expect(rows[0].innerHTML).toContain("John Doe");
    expect(rows[0].innerHTML).toContain("Custom Event");
    expect(rows[0].innerHTML).toContain("Test Center");
  });
});
