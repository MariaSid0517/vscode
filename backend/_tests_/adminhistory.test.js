/**
 * @jest-environment jsdom
 */

import './volunteerhistory.js';

beforeEach(() => {
  document.body.innerHTML = `
    <table>
      <tbody id="historyBody"></tbody>
    </table>
  `;
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders default matches when localStorage is empty", async () => {
  // Mock a logged-in user with required properties
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
  // Empty volunteer history
  localStorage.setItem('volunteerHistory', JSON.stringify([]));

  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const rows = document.querySelectorAll("tbody#historyBody tr");
  expect(rows.length).toBe(4); // 4 default rows
  expect(rows[0].innerHTML).toContain("Community Cleanup");
  expect(rows[1].innerHTML).toContain("Food Bank Support");
  expect(rows[2].innerHTML).toContain("Senior Center Tech Help");
  expect(rows[3].innerHTML).toContain("Park Restoration");
});

test("renders custom matches from localStorage if provided", async () => {
  // Mock logged-in user
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'John Doe' }));

  // Provide custom volunteer history
  const customHistory = [
    {
      volunteer_name: "John Doe",
      event_name: "Custom Event",
      event_date: "2025-10-30T12:00:00Z",
      location: "Test Center",
      required_skills: "Testing",
      urgency: "High",
      status: "pending"
    }
  ];
  localStorage.setItem('volunteerHistory', JSON.stringify(customHistory));

  fetch.mockResolvedValueOnce({ ok: true, json: async () => customHistory });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const rows = document.querySelectorAll("tbody#historyBody tr");
  expect(rows.length).toBe(1);
  expect(rows[0].innerHTML).toContain("John Doe");
  expect(rows[0].innerHTML).toContain("Custom Event");
  expect(rows[0].innerHTML).toContain("Test Center");
  expect(rows[0].innerHTML).toContain("pending");
});

test("renders 'No volunteer history found' if fetch returns empty", async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));

  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("tbody#historyBody td");
  expect(cell.textContent).toBe("No volunteer history found.");
});

test("renders error if fetch fails with non-ok status", async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));

  fetch.mockResolvedValueOnce({ ok: false, status: 500 });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("tbody#historyBody td");
  expect(cell.textContent).toContain("Server error: 500");
});

test("renders error if fetch throws", async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));

  fetch.mockRejectedValueOnce(new Error("Network Error"));

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("tbody#historyBody td");
  expect(cell.textContent).toContain("Network Error");
});

test("renders placeholders for missing optional fields", async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));

  const incompleteHistory = [
    {
      volunteer_name: "Alice",
      event_name: "Park Cleanup",
      status: "pending"
      // missing date, location, required_skills, urgency
    }
  ];
  localStorage.setItem('volunteerHistory', JSON.stringify(incompleteHistory));

  fetch.mockResolvedValueOnce({ ok: true, json: async () => incompleteHistory });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const row = document.querySelector("tbody#historyBody tr");
  expect(row.innerHTML).toContain("Alice");
  expect(row.innerHTML).toContain("Park Cleanup");
  expect(row.innerHTML).toContain("pending");
  // Check that missing fields show as '—'
  expect(row.innerHTML).toContain("—");
});
