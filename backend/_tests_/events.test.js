// backend/__tests__/events.test.js
const { validateEvent } = require("../Admin/event.js"); 

describe("Event Validation", () => {

  test("Valid event should pass", () => {
    const event = {
      name: "Health Clinic",
      description: "Free health clinic for the community",
      location: "Community Center",
      skills: ["medical", "volunteering"],
      urgency: "high",
      date: "2025-10-20"
    };

    const errors = validateEvent(event);
    expect(errors).toHaveLength(0); 
  });

  test("Missing required fields should fail", () => {
    const event = {
      name: "",
      description: "",
      location: "",
      skills: [],
      urgency: "",
      date: ""
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Event name is required.");
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("Location is required.");
    expect(errors).toContain("At least one skill is required.");
    expect(errors).toContain("Urgency is required.");
    expect(errors).toContain("Event date is required or invalid.");
  });

  test("Invalid types should fail", () => {
    const event = {
      name: 123,
      description: 456,
      location: true,
      skills: "not-an-array",
      urgency: 789,
      date: "invalid-date"
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Event name must be a string.");
    expect(errors).toContain("Description must be a string.");
    expect(errors).toContain("Location must be a string.");
    expect(errors).toContain("Skills must be an array.");
    expect(errors).toContain("Urgency must be a string.");
    expect(errors).toContain("Event date must be valid.");
  });

  test("Field length limits should fail", () => {
    const event = {
      name: "x".repeat(101),
      description: "x".repeat(501),
      location: "x".repeat(201),
      skills: ["skill1"],
      urgency: "medium",
      date: "2025-10-20"
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Event name cannot exceed 100 characters.");
    expect(errors).toContain("Description cannot exceed 500 characters.");
    expect(errors).toContain("Location cannot exceed 200 characters.");
  });

  test("Partial valid data should return only relevant errors", () => {
    const event = {
      name: "Community Fundraiser",
      description: "",
      location: "Town Hall",
      skills: [],
      urgency: "low",
      date: "2025-11-01"
    };

    const errors = validateEvent(event);
    expect(errors).toContain("Description is required.");
    expect(errors).toContain("At least one skill is required.");
    expect(errors).not.toContain("Event name is required.");
    expect(errors).not.toContain("Location is required.");
  });

});
