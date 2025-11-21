/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { validateLoginFields } = require("../Login/login.js");

describe("Login validation function", () => {
  test("returns error if email or password is missing", () => {
    expect(validateLoginFields("", "password")).toEqual({
      valid: false,
      error: "Email and password are required."
    });
    expect(validateLoginFields("email@example.com", "")).toEqual({
      valid: false,
      error: "Email and password are required."
    });
    expect(validateLoginFields("", "")).toEqual({
      valid: false,
      error: "Email and password are required."
    });
  });

  test("returns error if email is invalid", () => {
    expect(validateLoginFields("invalidemail", "password")).toEqual({
      valid: false,
      error: "Invalid email address."
    });
  });

  test("returns valid for correct email and password", () => {
    expect(validateLoginFields("test@example.com", "password")).toEqual({ valid: true });
  });
});

describe("Login form DOM interactions", () => {
  let form, emailInput, passwordInput;

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../../frontend/login and registration/login.html"),
      "utf8"
    );
    document.body.innerHTML = html;

    form = document.getElementById("loginform");
    emailInput = document.getElementById("loginemail");
    passwordInput = document.getElementById("loginpassword");

    // Mock alert, fetch, localStorage, and window.location
    global.alert = jest.fn();
    global.fetch = jest.fn();
    global.localStorage = {
      setItem: jest.fn()
    };
    delete global.window.location;
    global.window.location = { href: "" };

    // Require frontend login.js file (attach event listener)
    require("../../frontend/login and registration/login.js");
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("alerts if email or password is missing", async () => {
    emailInput.value = "";
    passwordInput.value = "";

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith("Email and password are required.");
  });

  test("successful login sets localStorage and redirects", async () => {
    emailInput.value = "user@example.com";
    passwordInput.value = "password";

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, role: "volunteer" })
    });

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 0));

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com", password: "password" })
      })
    );

    expect(global.localStorage.setItem).toHaveBeenCalledWith("user_id", 1);
    expect(global.localStorage.setItem).toHaveBeenCalledWith("role", "volunteer");
    expect(global.window.location.href).toBe("../Volunteer/UserProfile/userprofile.html");
  });

  test("alerts on invalid login (401)", async () => {
    emailInput.value = "user@example.com";
    passwordInput.value = "wrongpassword";

    global.fetch.mockResolvedValueOnce({ ok: false, status: 401 });

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith("Invalid email or password.");
  });

  test("alerts on fetch failure", async () => {
    emailInput.value = "user@example.com";
    passwordInput.value = "password";

    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith("Login failed: Network error");
  });

  test("alerts on unknown role", async () => {
    emailInput.value = "user@example.com";
    passwordInput.value = "password";

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 2, role: "unknown" })
    });

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise(r => setTimeout(r, 0));

    expect(global.alert).toHaveBeenCalledWith("Unknown role.");
  });
});
