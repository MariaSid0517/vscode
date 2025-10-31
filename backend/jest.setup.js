// backend/jest.setup.js
// -----------------------------------------------------------------------------
// Jest global setup file (configured in package.json "setupFiles")
// -----------------------------------------------------------------------------

// Polyfill TextEncoder/TextDecoder for jsdom compatibility in Node
const { TextEncoder, TextDecoder } = require("util");
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// -----------------------------------------------------------------------------
// Provide a default fetch (tests can override with jest-fetch-mock)
// -----------------------------------------------------------------------------
const fetchPolyfill = require("node-fetch");
if (!global.fetch) global.fetch = fetchPolyfill;

// -----------------------------------------------------------------------------
// Ensure a window object exists (for non-jsdom tests)
// -----------------------------------------------------------------------------
if (!global.window) global.window = {};

// -----------------------------------------------------------------------------
// DO NOT reassign window.location (that triggers jsdom navigation).
// Instead, ensure its methods are spy-able by defining them on the prototype.
// -----------------------------------------------------------------------------
try {
  const locationProto = Object.getPrototypeOf(window.location);
  if (locationProto) {
    try {
      Object.defineProperty(locationProto, "assign", {
        value: function () {},
        configurable: true,
        writable: true,
      });
    } catch {}
    try {
      Object.defineProperty(locationProto, "replace", {
        value: function () {},
        configurable: true,
        writable: true,
      });
    } catch {}
    try {
      Object.defineProperty(locationProto, "reload", {
        value: function () {},
        configurable: true,
        writable: true,
      });
    } catch {}
  }
} catch {
  // ignore
}

// -----------------------------------------------------------------------------
// Global alert mock
// -----------------------------------------------------------------------------
Object.defineProperty(window, "alert", {
  writable: true,
  configurable: true,
  value: jest.fn((msg) => {
    // eslint-disable-next-line no-console
    console.log("[Mock alert]:", msg);
  }),
});
global.alert = window.alert;

// Useful marker for code that wants to detect test mode
window.__JSDOM_TEST__ = true;
