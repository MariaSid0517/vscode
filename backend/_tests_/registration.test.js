// backend/_tests_/registration.test.js
const { validateRegistrationFields } = require("../Login/registration");

describe("Registration Validation", () => {
  test("should fail when fields are empty", () => {
    const result = validateRegistrationFields("", "", "", "");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  test("should fail with invalid email", () => {
    const result = validateRegistrationFields("invalid", "Password1!", "Password1!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid email/i);
  });

  test("should fail with short password", () => {
    const result = validateRegistrationFields("test@example.com", "Pass1!", "Pass1!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/8 characters/i);
  });

  test("should fail with no uppercase letter", () => {
    const result = validateRegistrationFields("test@example.com", "password1!", "password1!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/uppercase/i);
  });

  test("should fail with no lowercase letter", () => {
    const result = validateRegistrationFields("test@example.com", "PASSWORD1!", "PASSWORD1!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/lowercase/i);
  });

  test("should fail with no number", () => {
    const result = validateRegistrationFields("test@example.com", "Password!", "Password!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/number/i);
  });

  test("should fail with no special character", () => {
    const result = validateRegistrationFields("test@example.com", "Password1", "Password1", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/special/i);
  });

  test("should fail when passwords do not match", () => {
    const result = validateRegistrationFields("test@example.com", "Password1!", "Password2!", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/match/i);
  });

  test("should fail with invalid role", () => {
    const result = validateRegistrationFields("test@example.com", "Password1!", "Password1!", "guest");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/invalid role/i);
  });

  test("should pass with valid data", () => {
    const result = validateRegistrationFields("user@example.com", "Password1!", "Password1!", "volunteer");
    expect(result.valid).toBe(true);
  });
});
