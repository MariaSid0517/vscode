/**
 * @jest-environment jsdom
 */
import fs from "fs";
import path from "path";

describe("Volunteer Event Module", () => {
  let scriptContent;
  let tbody;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../Volunteer/Event.js");
    scriptContent = fs.readFileSync(filePath, "utf8");
  });

  beforeEach(() => {
    // Set up a mock table structure
    document.body.innerHTML = `
      <table id="eventsTable">
        <tbody></tbody>
      </table>
    `;
    tbody = document.querySelector("#eventsTable tbody");

    jest.resetModules();
    eval(scriptContent);
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  test("should populate the table with 3 event rows", () => {
    const rows = tbody.querySelectorAll("tr");
    expect(rows.length).toBe(3);
  });

  test("should render correct event names in rows", () => {
    const rows = tbody.querySelectorAll("tr");
    expect(rows[0].innerHTML).toContain("Community Clean-Up Drive");
    expect(rows[1].innerHTML).toContain("Food Bank Distribution");
    expect(rows[2].innerHTML).toContain("Holiday Toy Drive");
  });

  test("should apply proper status class names", () => {
    const rows = tbody.querySelectorAll("tr");
    expect(rows[0].querySelector("td.status-confirmed")).not.toBeNull();
    expect(rows[1].querySelector("td.status-pending")).not.toBeNull();
    expect(rows[2].querySelector("td.status-completed")).not.toBeNull();
  });
});
