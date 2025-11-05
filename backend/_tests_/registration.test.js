/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Login/registration.js");
  scriptContent = fs.readFileSync(filePath, "utf8");
});

beforeEach(() => {
  document.body.innerHTML = `
    <form id="registrationform">
      <input id="email" />
      <input id="password" />
      <input id="confirmPassword" />
      <select id="role"><option value="volunteer">Volunteer</option></select>
      <button type="submit"></button>
    </form>
  `;

  eval(scriptContent);
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Registration Validation", () => {
  test("fails with invalid role", () => {
    const result = validateRegistrationFields("test@example.com", "Password1!", "Password1!", "guest");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid role/i);
  });

  test("passes with volunteer role", () => {
    const result = validateRegistrationFields("test@example.com", "Password1!", "Password1!", "volunteer");
    expect(result.valid).toBe(true);
  });
});
