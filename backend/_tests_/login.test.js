const { validateRegistration, validateLogin, hashPassword } = require("../Login/login.js");

describe("Login & Registration Validations", () => {

  test("fails if any registration field is empty", () => {
    const result = validateRegistration("", "pass123", "pass123", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  test("fails if email format is invalid", () => {
    const result = validateRegistration("bademail", "pass123", "pass123", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format.");
  });

  test("fails if password is too short", () => {
    const result = validateRegistration("test@mail.com", "123", "123", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at least 6 characters long.");
  });

  test("fails if passwords do not match", () => {
    const result = validateRegistration("test@mail.com", "pass123", "wrong", "admin");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Passwords do not match.");
  });

  test("passes with valid registration input", () => {
    const result = validateRegistration("good@mail.com", "pass123", "pass123", "admin");
    expect(result.valid).toBe(true);
  });


  test("fails if login fields are missing", () => {
    const result = validateLogin("", "pass123", "admin");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("All fields are required.");
  });

  test("fails if login email is invalid", () => {
    const result = validateLogin("bademail", "pass123", "volunteer");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format.");
  });

  test("passes with correct login input", () => {
    const result = validateLogin("user@mail.com", "pass123", "admin");
    expect(result.valid).toBe(true);
  });


  test("hashPassword encodes text as base64", () => {
    expect(hashPassword("abc123")).toBe(Buffer.from("abc123", "utf-8").toString("base64"));
  });
});