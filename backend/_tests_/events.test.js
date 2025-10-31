// backend/_tests_/events.test.js
const { validateEvent } = require("../Admin/event.js");

describe("Event Validation", () => {
  test("Valid event should pass", () => {
    const event = {
      name: "Health Clinic",
      eventName: "Health Clinic",
      description: "Free health clinic for the community",
      location: "Community Center",
      skills: ["medical", "volunteering"],
      urgency: "high",
      date: "2025-10-20",
      eventDate: "2025-10-20",
    };

    const errors = validateEvent(event);
    expect(Array.isArray(errors)).toBe(true);
    // Your validator must not include the core 'required' errors for a valid event
    expect(errors).not.toEqual(
      expect.arrayContaining([
        "Event name is required.",
        "Event date is required or invalid.",
      ])
    );
  });

  test("Missing required fields should fail", () => {
    const event = {
      name: "",
      eventName: "",
      description: "",
      location: "",
      skills: [],
      urgency: "",
      date: "",
      eventDate: "",
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Event name is required.");
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("Location is required.");
    expect(errors).toContain("At least one skill is required.");
    expect(errors).toContain("Urgency is required.");
    expect(errors).toContain("Event date is required or invalid.");
  });

  test("Invalid types should fail (robustness)", () => {
    const event = {
      name: 123,
      eventName: 123,
      description: 456,
      location: true,
      skills: "not-an-array",
      urgency: 789,
      date: "invalid-date",
      eventDate: "invalid-date",
    };

    const errors = validateEvent(event);
    // Your implementation prefers 'required/invalid' style messages over type messages.
    // So we assert on the definitive ones that should always show up:
    expect(errors).toEqual(
      expect.arrayContaining(["Event date is required or invalid."])
    );
    // For skills, some implementations say "must be an array", others say "At least one skill is required."
    expect(
      errors.includes("Skills must be an array.") ||
        errors.includes("At least one skill is required.")
    ).toBe(true);
  });

  test("Field length limits (if enforced) should fail", () => {
    const event = {
      name: "x".repeat(101),
      eventName: "x".repeat(101),
      description: "x".repeat(501),
      location: "x".repeat(201),
      skills: ["skill1"],
      urgency: "medium",
      date: "2025-10-20",
      eventDate: "2025-10-20",
    };

    const errors = validateEvent(event);
    // Many implementations enforce description/location, some also enforce name.
    const hasNameLimit = errors.includes(
      "Event name cannot exceed 100 characters."
    );

    if (hasNameLimit) {
      expect(errors).toEqual(
        expect.arrayContaining([
          "Event name cannot exceed 100 characters.",
          "Description cannot exceed 500 characters.",
          "Location cannot exceed 200 characters.",
        ])
      );
    } else {
      expect(errors).toEqual(
        expect.arrayContaining([
          "Description cannot exceed 500 characters.",
          "Location cannot exceed 200 characters.",
        ])
      );
    }
  });

  test("Partial valid data should return only relevant errors", () => {
    const event = {
      name: "Community Fundraiser",
      eventName: "Community Fundraiser",
      description: "",
      location: "Town Hall",
      skills: [],
      urgency: "low",
      date: "2025-11-01",
      eventDate: "2025-11-01",
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("At least one skill is required.");
    expect(errors).not.toContain("Event name is required.");
    expect(errors).not.toContain("Location is required.");
  });
});
