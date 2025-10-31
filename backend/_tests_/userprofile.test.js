/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

describe("Volunteer User Profile", () => {
  let window, document, form, alertMock, fetchMock;

  const jsPath = path.resolve(__dirname, "../Volunteer/userprofile.js");
  const jsCode = fs.readFileSync(jsPath, "utf8");

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

  const normalize = (msg) => String(msg).toLowerCase();

  function setupDOM() {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {}); // silence jsdom errors

    const dom = new JSDOM(html, {
      url: "https://example.org/",
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
    });

    window = dom.window;
    document = window.document;
    form = document.getElementById("profileForm");
    window.__JSDOM_TEST__ = true;

    // Route alerts; spy on global.alert so either window.alert/global.alert get intercepted
    global.alert = window.alert.bind(window);
    alertMock = jest.spyOn(global, "alert").mockImplementation(() => {});

    // ---- Optional redirect spying helpers (not asserted in this test) ----
    Object.defineProperty(window, "__redirect", {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
    try {
      Object.defineProperty(window.location, "assign", {
        configurable: true,
        writable: true,
        value: (url) => window.__redirect(url, "assign"),
      });
    } catch {}
    try {
      Object.defineProperty(window.location, "replace", {
        configurable: true,
        writable: true,
        value: (url) => window.__redirect(url, "replace"),
      });
    } catch {}

    // Mock localStorage
    const store = { user_id: "1" };
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => (store[k] = String(v)),
        removeItem: (k) => delete store[k],
        clear: () => Object.keys(store).forEach((k) => delete store[k]),
      },
      configurable: true,
    });

    // Mock fetch
    fetchMock = jest.fn((url, opts = {}) => {
      if (typeof url === "string" && url.includes("/profiles/1") && (!opts.method || opts.method === "GET")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            first_name: "John",
            last_name: "Doe",
            address: "123 Main St",
            city: "Austin",
            state_id: "TX",
            zipcode: "73301",
            preferences: "Teaching",
            skills: "teaching,cooking",
          }),
        });
      }
      if (opts && opts.method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      return Promise.reject(new Error("Unexpected fetch URL"));
    });

    window.fetch = fetchMock;
    global.fetch = fetchMock;

    // Inject the userprofile.js AFTER mocks
    const runScript = new Function("window", `const document = window.document;\n${jsCode}`);
    runScript(window);

    // Fire DOMContentLoaded to initialize
    document.dispatchEvent(new window.Event("DOMContentLoaded"));

    return { document, window, fetchMock };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ✅ Test 1: Validation of required fields
  test("shows alert if required fields are missing", async () => {
    setupDOM();
    await new Promise((r) => setTimeout(r, 30));

    // Clear all required fields
    document.getElementById("fullName").value = "";
    document.getElementById("address1").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("zip").value = "";

    form.dispatchEvent(new window.Event("submit", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 40));

    expect(alertMock).toHaveBeenCalled();

    const msgs = alertMock.mock.calls.map(([m]) => normalize(m));
    const hasRequiredWarning = msgs.some((m) => m.includes("required") && m.includes("fill"));
    expect(hasRequiredWarning).toBe(true);
  });

  // ✅ Test 2: Save profile and show success (redirect optional at runtime)
  test("saves profile and shows success message", async () => {
    setupDOM();
    await new Promise((r) => setTimeout(r, 30));

    document.getElementById("fullName").value = "Jane Doe";
    document.getElementById("address1").value = "123 Main St";
    document.getElementById("city").value = "Houston";
    document.getElementById("state").value = "TX";
    document.getElementById("zip").value = "77001";
    document.getElementById("skills").options[0].selected = true;

    form.dispatchEvent(new window.Event("submit", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 60)); // allow async

    const msgs = alertMock.mock.calls.map(([m]) => normalize(m));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/profiles/1"),
      expect.objectContaining({ method: "PUT" })
    );

    const hasSuccess = msgs.some((m) => m.includes("success"));
    expect(hasSuccess).toBe(true);
  });

  // ✅ Test 3: Load profile from GET
  test("loads existing profile data correctly", async () => {
    setupDOM();
    await new Promise((r) => setTimeout(r, 30));

    expect(document.getElementById("fullName").value).toBe("John Doe");
    expect(document.getElementById("city").value).toBe("Austin");
    expect(document.getElementById("state").value).toBe("TX");
    expect(document.getElementById("address1").value).toBe("123 Main St");
  });
});
