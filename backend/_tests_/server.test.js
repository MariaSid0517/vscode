const request = require("supertest");
const app = require("../server"); // ensure path is correct

describe("API Endpoints", () => {

  let userId, eventId;

  // AUTH
  test("Register user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "a@test.com",
      password: "abcdef"
    });
    expect(res.statusCode).toBe(200);
    userId = res.body.userId;
  });

  test("Login user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "a@test.com",
      password: "abcdef"
    });
    expect(res.statusCode).toBe(200);
  });

  // PROFILE
  test("Save profile", async () => {
    const res = await request(app).put(`/profiles/${userId}`).send({
      name: "Jane",
      address1: "123 Road",
      city: "Austin",
      state: "TX",
      zip: "73301",
      skills: ["spanish"]
    });
    expect(res.statusCode).toBe(200);
  });

  // EVENTS
  test("Create event", async () => {
    const res = await request(app).post("/events").send({
      title: "Food Drive",
      location: "Center",
      requiredSkills: ["spanish"],
      urgency: "low"
    });
    expect(res.statusCode).toBe(200);
    eventId = res.body.id;
  });

  // MATCH
  test("Match volunteers", async () => {
    const res = await request(app).post("/match").send({ eventId });
    expect(res.statusCode).toBe(200);
    expect(res.body.matches.length).toBeGreaterThan(0);
  });

});


