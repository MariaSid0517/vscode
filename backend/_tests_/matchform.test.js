/**
 * @jest-environment jsdom
 */

require('jest-fetch-mock').enableMocks();
require("../Admin/matchform"); // <-- adjust path

describe("Match Form Initialization", () => {
  let volunteerSelect, eventSelect, matchList, matchingForm;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="matchingForm">
        <select id="volunteerSelect"></select>
        <select id="eventSelect"></select>
      </form>
      <ul id="matchList"></ul>
    `;

    volunteerSelect = document.getElementById("volunteerSelect");
    eventSelect = document.getElementById("eventSelect");
    matchList = document.getElementById("matchList");
    matchingForm = document.getElementById("matchingForm");

    fetch.resetMocks();
  });

  test("loads volunteers into dropdown", async () => {
    fetch.mockResponses(
      [JSON.stringify([{ id: 1, name: "Maria", skills: ["cpr"] }]), { status: 200 }],
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify([]), { status: 200 }]
    );

      document.dispatchEvent(new Event("DOMContentLoaded"));

      // Let async fetches complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(volunteerSelect.options.length).toBe(2);
      expect(volunteerSelect.options[1].textContent).toBe("Maria");
  });

  test("loads events into dropdown", async () => {
    fetch.mockResponses(
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify([{ id: 10, name: "Food Drive", required_skills: [] }]), { status: 200 }],
      [JSON.stringify([]), { status: 200 }]
    );

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(resolve => setTimeout(resolve, 0));


    expect(eventSelect.options.length).toBe(2);
    expect(eventSelect.options[1].textContent).toBe("Food Drive");
  });

  test("loads matches list", async () => {
    fetch.mockResponses(
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify([{ volunteer: { name: "John" }, event: { name: "Cleanup" }}]), { status: 200 }]
    );

    document.dispatchEvent(new Event("DOMContentLoaded"));
    await new Promise(resolve => setTimeout(resolve, 0));


    expect(matchList.textContent).toContain("John → Cleanup");
  });
});
