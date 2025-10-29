// backend/jest.setup.js
//  Runs before every Jest test (see package.json "setupFiles")

// -----------------------------------------------------------------------------
// Polyfill TextEncoder / TextDecoder (required by jsdom in Node environments)
// -----------------------------------------------------------------------------
const { TextEncoder, TextDecoder } = require("util");

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// -----------------------------------------------------------------------------
//  Global window and alert mock
// -----------------------------------------------------------------------------
if (!global.window) global.window = {};

Object.defineProperty(window, "alert", {
  writable: true,
  configurable: true,
  value: jest.fn((msg) => {
    console.log("[Mock alert]:", msg);
  }),
});

// Make alert available globally as well
global.alert = window.alert;

// -----------------------------------------------------------------------------
//  Mark as JSDOM environment (used in HTML to skip script loading)
// -----------------------------------------------------------------------------
window.__JSDOM_TEST__ = true;
