/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

let scriptContent;

beforeAll(() => {
  const filePath = path.resolve(__dirname, "../Login/login.js");
  scriptContent = fs.readFileSync(filePath, "utf8");
});

beforeEach(() => {
  document.body.innerHTML = `
    <form id="loginform">
      <input id="loginemail" />
      <input id="loginpassword" />
      <button type="submit"></button>
    </form>
  `;

  eval(scriptContent);
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("Login Validation", () => {
  test("fails with short password", () => {
    const result = validateLoginFields("user@example.com", "short");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/8 characters/i);
  });

  test("fails with invalid email", () => {
    const result = validateLoginFields("bademail", "Password1!");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid email/i);
  });

  test("passes with valid email and password", () => {
    const result = validateLoginFields("user@example.com", "Password1!");
    expect(result.valid).toBe(true);
  });
});
