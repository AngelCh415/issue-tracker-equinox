import request from 'supertest';
import app from '../src/app.js';
import { initDb } from '../src/db.js';

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initDb();
});
describe("API /api/projects", () => {
    it("should return a list of projects", async () => {
        const response = await request(app).get("/api/projects");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("API /api/issues", () => {
    it("should return a list of issues", async () => {
        const response = await request(app).get("/api/issues");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("API error handling", () => {
    it("should return 404 for unknown routes", async () => {
        const response = await request(app).get("/api/unknownroute");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Route not found");
    });
});

describe("Health check", () => {
    it("should return service status", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "ok");
        expect(response.body).toHaveProperty("service", "issue-tracker-api");
    });
});