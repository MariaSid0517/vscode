
/**
 * @jest-environment jsdom
 */
/*
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

describe("Volunteer User Profile", () => {
  let window, document, form, alertMock;

  const jsPath = path.resolve(__dirname, "../Volunteer/userprofile.js");
  const jsCode = fs.readFileSync(jsPath, "utf8");

  // Minimal mock HTML used for tests — avoids external fetches
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <form id="profileForm">
        <input id="fullName" />
        <input id="address1" />
        <input id="address2" />
        <input id="city" />
        <select id="state">
          <option value="">--</option>
          <option value="TX">TX</option>
        </select>
        <input id="zip" />
        <textarea id="preferences"></textarea>
        <select id="skills" multiple>
          <option value="teaching">Teaching</option>
          <option value="cooking">Cooking</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </body>
    </html>
  `;

  function setupDOM(preloadProfile = null) {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {}); // suppress jsdom fetch/nav errors

    const dom = new JSDOM(html, {
      url: "https://example.org/",
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
    });

    window = dom.window;
    document = window.document;

    // ✅ Mark this as a JSDOM test instance so app code skips real redirects
    window.__JSDOM_TEST__ = true;

    // ✅ Mock alert BEFORE running script
    alertMock = jest.fn();
    window.alert = alertMock;

    // ✅ Mock localStorage
    const store = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (k) => store[k] || null,
        setItem: (k, v) => {
          store[k] = String(v);
        },
        removeItem: (k) => delete store[k],
        clear: () => Object.keys(store).forEach((k) => delete store[k]),
      },
      configurable: true,
    });

    // ✅ Preload profile if requested
    if (preloadProfile) {
      window.localStorage.setItem("volunteerProfile", JSON.stringify(preloadProfile));
    }

    // ✅ Run the script inside this DOM
    const runScript = new Function("window", `
      const document = window.document;
      ${jsCode}
      document.dispatchEvent(new window.Event("DOMContentLoaded"));
    `);
    runScript(window);

    form = document.getElementById("profileForm");
    return { document, window };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows alert if required fields are missing", () => {
    setupDOM();
    form.dispatchEvent(new window.Event("submit", { bubbles: true }));
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Please fill in all required fields.");
  });

  test("saves profile and performs redirect (captured in test env)", () => {
    setupDOM();
    document.getElementById("fullName").value = "Jane Doe";
    document.getElementById("address1").value = "123 Main St";
    document.getElementById("city").value = "Houston";
    document.getElementById("state").value = "TX";
    document.getElementById("zip").value = "77001";
    document.getElementById("skills").options[0].selected = true;

    form.dispatchEvent(new window.Event("submit", { bubbles: true }));

    const saved = JSON.parse(window.localStorage.getItem("volunteerProfile"));
    expect(saved).not.toBeNull();
    expect(saved.name).toBe("Jane Doe");

    // ✅ In test mode, the app writes the redirect URL here:
    expect(window.__lastNavigatedTo).toBe("volunteerdash.html");
  });

  test("loads existing profile data correctly", () => {
    const mockProfile = {
      name: "John Doe",
      address1: "100 Test Ave",
      city: "Austin",
      state: "TX",
      zip: "73301",
      skills: ["teaching"],
    };
    const { document } = setupDOM(mockProfile);
    expect(document.getElementById("fullName").value).toBe("John Doe");
    expect(document.getElementById("city").value).toBe("Austin");
    expect(document.getElementById("state").value).toBe("TX");
  });
});
*/
/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

describe("Volunteer User Profile", () => {
  let window, document, form, alertMock;

  const jsPath = path.resolve(__dirname, "../Volunteer/userprofile.js");
  const jsCode = fs.readFileSync(jsPath, "utf8");

  // Minimal mock HTML used for tests — avoids external fetches
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <form id="profileForm">
        <input id="fullName" />
        <input id="address1" />
        <input id="address2" />
        <input id="city" />
        <select id="state">
          <option value="">--</option>
          <option value="TX">TX</option>
        </select>
        <input id="zip" />
        <textarea id="preferences"></textarea>
        <select id="skills" multiple>
          <option value="teaching">Teaching</option>
          <option value="cooking">Cooking</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </body>
    </html>
  `;

  function setupDOM(preloadProfile = null) {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {}); // suppress jsdom fetch/nav errors

    const dom = new JSDOM(html, {
      url: "https://example.org/",
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
    });

    window = dom.window;
    document = window.document;

    // ✅ Mark this as a JSDOM test instance so app code skips real redirects
    window.__JSDOM_TEST__ = true;

    // ✅ Mock alert BEFORE running script
    alertMock = jest.fn();
    window.alert = alertMock;

    // ✅ Mock localStorage
    const store = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (k) => store[k] || null,
        setItem: (k, v) => {
          store[k] = String(v);
        },
        removeItem: (k) => delete store[k],
        clear: () => Object.keys(store).forEach((k) => delete store[k]),
      },
      configurable: true,
    });

    // ✅ Preload profile if requested
    if (preloadProfile) {
      window.localStorage.setItem("volunteerProfile", JSON.stringify(preloadProfile));
    }

    // ✅ Run the script inside this DOM
    const runScript = new Function("window", `
      const document = window.document;
      ${jsCode}
      document.dispatchEvent(new window.Event("DOMContentLoaded"));
    `);
    runScript(window);

    form = document.getElementById("profileForm");
    return { document, window };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows alert if required fields are missing", () => {
    setupDOM();
    form.dispatchEvent(new window.Event("submit", { bubbles: true }));
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Please fill in all required fields.");
  });

  test("saves profile and performs redirect (captured in test env)", () => {
    setupDOM();
    document.getElementById("fullName").value = "Jane Doe";
    document.getElementById("address1").value = "123 Main St";
    document.getElementById("city").value = "Houston";
    document.getElementById("state").value = "TX";
    document.getElementById("zip").value = "77001";
    document.getElementById("skills").options[0].selected = true;

    form.dispatchEvent(new window.Event("submit", { bubbles: true }));

    const saved = JSON.parse(window.localStorage.getItem("volunteerProfile"));
    expect(saved).not.toBeNull();
    expect(saved.name).toBe("Jane Doe");

    // Updated expectation to match the app's new redirect target
    expect(window.__lastNavigatedTo).toBe("../VolunteerDashboard/Volunteerdashboard.html");
  });

  test("loads existing profile data correctly", () => {
    const mockProfile = {
      name: "John Doe",
      address1: "100 Test Ave",
      city: "Austin",
      state: "TX",
      zip: "73301",
      skills: ["teaching"],
    };
    const { document } = setupDOM(mockProfile);
    expect(document.getElementById("fullName").value).toBe("John Doe");
    expect(document.getElementById("city").value).toBe("Austin");
    expect(document.getElementById("state").value).toBe("TX");
  });
});
