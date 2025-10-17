/**
 * @jest-environment jsdom
 */

describe("Login & Registration (DOM + validation)", () => {
  let validateLoginFields;

  const mountDOM = () => {
    document.body.innerHTML = `
      <form id="loginform">
        <input id="loginemail" />
        <input id="loginpassword" />
        <select id="loginrole">
          <option value="volunteer">volunteer</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit"></button>
      </form>
    `;
  };

  beforeEach(() => {
    jest.resetModules();        // clear require cache for fresh listeners
    localStorage.clear();
    mountDOM();

    // require AFTER mounting DOM so the script can attach its listeners
    ({ validateLoginFields } = require("../Login/login.js"));

    // trigger the script's DOMContentLoaded handler to bind the submit listener
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });

  // ---------- pure function tests ----------
  describe("validateLoginFields()", () => {
    test("fails if any field is missing", () => {
      const res = validateLoginFields("", "", "");
      expect(res.valid).toBe(false);
      expect(res.error).toBe("All fields are required.");
    });

    test("fails on invalid email format", () => {
      const res = validateLoginFields("bademail", "secret1", "volunteer");
      expect(res.valid).toBe(false);
      expect(res.error).toBe("Invalid email format.");
    });

    test("fails if password is too short", () => {
      const res = validateLoginFields("user@mail.com", "123", "admin");
      expect(res.valid).toBe(false);
      expect(res.error).toBe("Password must be at least 6 characters.");
    });

    test("passes with valid input", () => {
      const res = validateLoginFields("user@mail.com", "secret1", "admin");
      expect(res.valid).toBe(true);
    });
  });

  // ---------- DOM behavior tests ----------
  describe("login form submission", () => {
    test("alerts when fields are missing", () => {
      const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
      // leave defaults empty
      document.getElementById("loginform").dispatchEvent(new Event("submit"));
      expect(alertMock).toHaveBeenCalledWith("All fields are required.");
      alertMock.mockRestore();
    });

    test("alerts when email is invalid", () => {
      const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
      document.getElementById("loginemail").value = "not-an-email";
      document.getElementById("loginpassword").value = "secret1";
      document.getElementById("loginrole").value = "volunteer";
      document.getElementById("loginform").dispatchEvent(new Event("submit"));
      expect(alertMock).toHaveBeenCalledWith("Invalid email format.");
      alertMock.mockRestore();
    });

    test("alerts when password is too short", () => {
      const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
      document.getElementById("loginemail").value = "user@mail.com";
      document.getElementById("loginpassword").value = "123";
      document.getElementById("loginrole").value = "admin";
      document.getElementById("loginform").dispatchEvent(new Event("submit"));
      expect(alertMock).toHaveBeenCalledWith("Password must be at least 6 characters.");
      alertMock.mockRestore();
    });

    test("alerts success for valid input", () => {
      const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
      document.getElementById("loginemail").value = "user@mail.com";
      document.getElementById("loginpassword").value = "secret1";
      document.getElementById("loginrole").value = "volunteer";
      document.getElementById("loginform").dispatchEvent(new Event("submit"));
      expect(alertMock).toHaveBeenCalledWith("Login successful as volunteer!");
      alertMock.mockRestore();
    });
  });
});
