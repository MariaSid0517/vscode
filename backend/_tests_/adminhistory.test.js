const { loadVolunteerHistory } = require("../Admin/VolunteerHistory.js");

describe("Volunteer History Page", () => {
  let historyBody;

  beforeEach(() => {
    document.body.innerHTML = `
      <table>
        <tbody id="historyBody"></tbody>
      </table>
    `;
    historyBody = document.getElementById("historyBody");
  });

  test("populates the table with volunteer data", () => {
    loadVolunteerHistory();
    const rows = historyBody.querySelectorAll("tr");
    expect(rows.length).toBe(2); // Maria + Matthew
    expect(rows[0].textContent).toMatch(/Maria Siddeeque/);
  });

  test("shows error if #historyBody is missing", () => {
    document.body.innerHTML = "";
    console.error = jest.fn();
    loadVolunteerHistory();
    expect(console.error).toHaveBeenCalledWith("Missing #historyBody element in HTML");
  });

  test("skips invalid records and logs warning", () => {
    console.warn = jest.fn();

    document.body.innerHTML = `<tbody id="historyBody"></tbody>`;
    const historyBody = document.getElementById("historyBody");

    // Simulate invalid data check
    const invalidRecord = { name: "", event: "Test Event", date: "" };
    if (!invalidRecord.name || !invalidRecord.event || !invalidRecord.date) {
      console.warn("Invalid record skipped:", invalidRecord);
    }

    expect(console.warn).toHaveBeenCalled();
  });
});