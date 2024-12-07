const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(async () => {
  await db.end();
});

describe("GET /companies", () => {
  test("Returns a list of companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("companies");
    expect(Array.isArray(res.body.companies)).toBe(true);
  });
});
