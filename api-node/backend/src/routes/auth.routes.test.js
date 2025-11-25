import request from 'supertest';
import app from '../app.js';

describe("API /api/auth/login", () => {
    it("should authenticate user and return token", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@tes", password: "password123" });
                
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("token", "fake-jwt-token");
        expect(response.body.user).toHaveProperty("email", "test@tes");
    });
});
