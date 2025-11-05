/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <table>
      <tbody id="historyBody"></tbody>
    </table>
  `;

  // Mock fetch
  global.fetch = jest.fn();

  // Clear localStorage
  localStorage.clear();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("shows 'Please log in' if no user_id in localStorage", async () => {
  // Make sure localStorage is empty
  localStorage.removeItem("user_id");

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("#historyBody td");
  expect(cell.textContent).toBe("Please log in to view your history.");
});

test("shows 'No completed events yet' if fetch returns empty array", async () => {
  localStorage.setItem("user_id", "123");

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("#historyBody td");
  expect(cell.textContent).toBe("No completed events yet.");
});

test("renders events correctly when fetch returns data", async () => {
  localStorage.setItem("user_id", "123");

  const events = [
    {
      event_name: "Beach Cleanup",
      event_description: "Cleaning the beach",
      location: "Ocean Bay",
      required_skills: "Teamwork",
      urgency: "Medium",
      event_date: "2025-10-30T12:00:00Z"
    },
    {
      event_name: "Park Restoration",
      // missing optional fields
      event_date: null
    }
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => events
  });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const rows = document.querySelectorAll("#historyBody tr");
  expect(rows.length).toBe(2);

  // First event
  expect(rows[0].innerHTML).toContain("Beach Cleanup");
  expect(rows[0].innerHTML).toContain("Cleaning the beach");
  expect(rows[0].innerHTML).toContain("Ocean Bay");
  expect(rows[0].innerHTML).toContain("Teamwork");
  expect(rows[0].innerHTML).toContain("Medium");
  expect(rows[0].innerHTML).toContain(new Date("2025-10-30T12:00:00Z").toLocaleDateString());
  expect(rows[0].innerHTML).toContain("Completed");

  // Second event with missing fields
  expect(rows[1].innerHTML).toContain("Park Restoration");
  expect(rows[1].innerHTML).toContain("—"); // placeholders
  expect(rows[1].innerHTML).toContain("Completed");
});

test("shows error message if fetch fails", async () => {
  localStorage.setItem("user_id", "123");

  fetch.mockRejectedValueOnce(new Error("Network Error"));

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("#historyBody td");
  expect(cell.textContent).toContain("Error loading history: Network Error");
});

test("throws error if fetch returns non-ok status", async () => {
  localStorage.setItem("user_id", "123");

  fetch.mockResolvedValueOnce({
    ok: false,
    status: 500
  });

  document.dispatchEvent(new Event("DOMContentLoaded"));
  await new Promise(process.nextTick);

  const cell = document.querySelector("#historyBody td");
  expect(cell.textContent).toContain("Error loading history: Server error: 500");
});
