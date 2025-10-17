/**
 * @jest-environment jsdom
 */
import fs from "fs";
import path from "path";

describe("Volunteer History Module", () => {
  let scriptContent;
  let historyBody;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../Admin/VolunteerHistory.js");
    scriptContent = fs.readFileSync(filePath, "utf8");
  });

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <table>
        <tbody id="historyBody"></tbody>
      </table>
    `;
    historyBody = document.getElementById("historyBody");

    localStorage.clear();
    jest.resetModules();

    // Load and execute the script
    eval(scriptContent);
    // Trigger DOMContentLoaded to run displayHistory
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  test("should display 'no records' message if no matches in localStorage", () => {
    localStorage.setItem("matches", JSON.stringify([]));

    // Re-run the script after setting empty matches
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(historyBody.innerHTML).toContain("No volunteer participation records yet");
    expect(historyBody.querySelectorAll("tr").length).toBe(1);
  });

  test("should render default matches when no localStorage matches exist", () => {
    const rows = historyBody.querySelectorAll("tr");
    expect(rows.length).toBe(3); // default array has 3 records
    expect(rows[0].innerHTML).toContain("Maria Siddeeque");
    expect(rows[1].innerHTML).toContain("Matthew Reyna");
    expect(rows[2].innerHTML).toContain("Madeeha Siddeeque");
  });

  test("should use matches from localStorage if provided", () => {
    const customMatches = [
      {
        volunteerName: "John Doe",
        eventName: "Custom Event",
        eventDate: "2025-01-01",
        location: "Test Location",
        skills: ["Testing"],
        urgency: "Low",
        status: "Completed"
      }
    ];

    localStorage.setItem("matches", JSON.stringify(customMatches));

    // Reset DOM and run again to pick up new data
    document.body.innerHTML = `
      <table>
        <tbody id="historyBody"></tbody>
      </table>
    `;
    historyBody = document.getElementById("historyBody");
    eval(scriptContent);
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const rows = historyBody.querySelectorAll("tr");
    expect(rows.length).toBe(1);
    expect(rows[0].innerHTML).toContain("John Doe");
    expect(rows[0].innerHTML).toContain("Custom Event");
  });
});
