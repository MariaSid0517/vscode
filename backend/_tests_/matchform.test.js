/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

let initMatchForm, volunteers, events, matches;

beforeEach(() => {
  // Load HTML template
  const html = fs.readFileSync(path.resolve(__dirname, "../../frontend/Admin/matchForm/matchform.html"), "utf8");
  document.documentElement.innerHTML = html;

  // Mock alert and confirm
  global.alert = jest.fn();
  global.confirm = jest.fn(() => true); 

  // Load script
  ({ initMatchForm, volunteers, events, matches } = require("../Admin/matchform.js"));

  // Initialize
  initMatchForm();
});

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test("creates a match when volunteer and event are selected", () => {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchingForm = document.getElementById("matchingForm");
  const matchList = document.getElementById("matchList");

  volunteerSelect.value = "1";
  eventSelect.value = "1";

  matchingForm.dispatchEvent(new Event("submit"));

  expect(matchList.innerHTML).toContain("Maria Siddeeque → Mental Health Outreach");
});

test("alerts if volunteer or event not selected", () => {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchingForm = document.getElementById("matchingForm");

  volunteerSelect.value = "";
  eventSelect.value = "1";

  matchingForm.dispatchEvent(new Event("submit"));

  expect(global.alert).toHaveBeenCalledWith("Please select both a volunteer and an event.");
});

test("prevents duplicate matches", () => {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchingForm = document.getElementById("matchingForm");

  volunteerSelect.value = "1";
  eventSelect.value = "1";

  matchingForm.dispatchEvent(new Event("submit"));
  matchingForm.dispatchEvent(new Event("submit")); // duplicate

  expect(global.alert).toHaveBeenCalledWith("This volunteer is already matched to that event!");
});

test("warns if volunteer lacks required skills", () => {
  const volunteerSelect = document.getElementById("volunteerSelect");
  const eventSelect = document.getElementById("eventSelect");
  const matchingForm = document.getElementById("matchingForm");

  volunteerSelect.value = "2"; // Matthew lacks Public Speaking
  eventSelect.value = "1"; // Event requires Public Speaking

  matchingForm.dispatchEvent(new Event("submit"));

  expect(global.confirm).toHaveBeenCalledWith(
    "Warning: This volunteer is missing the following required skills for this event: Public Speaking. Do you still want to match them?"
  );
});
