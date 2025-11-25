import request from "supertest";
import app from "../src/app.js";
import { initDb } from "../src/db.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await initDb();
});

describe("API /api/projects", () => {
  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({
        name: "Test Project",
        description: "Project created from test",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "Test Project");
    expect(res.body).toHaveProperty(
      "description",
      "Project created from test"
    );
  });

  it("should list projects including the created one", async () => {
    const createRes = await request(app)
      .post("/api/projects")
      .send({
        name: "Another Test Project",
        description: "From list test",
      });

    const createdId = createRes.body.id;

    const listRes = await request(app).get("/api/projects");

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    const found = listRes.body.find((p) => p.id === createdId);
    expect(found).toBeDefined();
    expect(found.name).toBe("Another Test Project");
  });
});
