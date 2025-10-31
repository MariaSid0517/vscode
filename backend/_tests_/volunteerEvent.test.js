/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

describe("Volunteer Event Module", () => {
  let scriptContent;
  let tbody;

  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../Volunteer/Event.js");
    scriptContent = fs.readFileSync(filePath, "utf8");
  });

  beforeEach(async () => {
    document.body.innerHTML = `
      <table id="eventsTable">
        <tbody></tbody>
      </table>
    `;
    tbody = document.querySelector("#eventsTable tbody");

    // Ensure logged-in state
    window.localStorage.setItem("user_id", "123");

    const sampleEvents = [
      {
        id: 1,
        name: "Community Clean-Up Drive",
        title: "Community Clean-Up Drive",
        event_name: "Community Clean-Up Drive",
        event: { name: "Community Clean-Up Drive" },
        status: "confirmed",
      },
      {
        id: 2,
        name: "Food Bank Distribution",
        title: "Food Bank Distribution",
        event_name: "Food Bank Distribution",
        event: { name: "Food Bank Distribution" },
        status: "pending",
      },
      {
        id: 3,
        name: "Holiday Toy Drive",
        title: "Holiday Toy Drive",
        event_name: "Holiday Toy Drive",
        event: { name: "Holiday Toy Drive" },
        status: "completed",
      },
    ];

    // Mock fetch to always return the same events array regardless of URL/method
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => sampleEvents,
    }));
    window.fetch = global.fetch;

    jest.resetModules();
    // eslint-disable-next-line no-eval
    eval(scriptContent);

    document.dispatchEvent(new Event("DOMContentLoaded"));

    // Allow any async processing to occur
    await new Promise((r) => setTimeout(r, 40));
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
});
