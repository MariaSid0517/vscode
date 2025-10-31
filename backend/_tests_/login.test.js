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

describe("Login DOM interactions", () => {
  let emailInput, passwordInput, form, fetchMock;

  beforeEach(() => {
    // Mock DOM
    document.body.innerHTML = `
      <form id="loginform">
        <input id="loginemail" />
        <input id="loginpassword" />
        <button type="submit">Login</button>
      </form>
    `;

    emailInput = document.getElementById("loginemail");
    passwordInput = document.getElementById("loginpassword");
    form = document.getElementById("loginform");

    // Mock fetch globally
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should prevent submission with invalid input", async () => {
    emailInput.value = "bademail";
    passwordInput.value = "short";

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(alertMock).toHaveBeenCalled();
    alertMock.mockRestore();
  });

  test("should submit valid credentials and call API", async () => {
    emailInput.value = "user@example.com";
    passwordInput.value = "Password1!";

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user_id: 1, role: "volunteer" }),
    });

    const profileFetchMock = fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: "Jane" }),
    });

    // Spy on location
    delete window.location;
    window.location = { href: "" };

    await form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(fetchMock).toHaveBeenCalled();
    expect(window.location.href).toContain("volunteerdashboard.html");
  });
});
