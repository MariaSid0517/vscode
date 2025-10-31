// backend/_tests_/login.test.js
const { validateLoginFields } = require("../Login/login");

describe("Login Validation", () => {
  test("should fail if fields are empty", () => {
    const result = validateLoginFields("", "");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  test("should fail with invalid email", () => {
    const result = validateLoginFields("invalidemail", "Password1!");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid email/i);
  });

  test("should fail with short password", () => {
    const result = validateLoginFields("user@example.com", "short");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/8 characters/i);
  });

  test("should pass with valid input", () => {
    const result = validateLoginFields("user@example.com", "Password1!");
    expect(result.valid).toBe(true);
  });
});
