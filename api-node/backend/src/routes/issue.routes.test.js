import request from 'supertest';
import app from '../app.js';

describe("API /api/issues", () => {
    it("should return a list of issues", async () => {
        const response = await request(app).get("/api/issues");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("API /api/issues POST", () => {
    it("should create a new issue", async () => {
        const newIssue = {
            projectId: 1,
            title: "Test Issue",
            description: "This is a test issue."
        };
        const response = await request(app)
            .post("/api/issues")
            .send(newIssue);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("projectId", newIssue.projectId);
        expect(response.body).toHaveProperty("title", newIssue.title);
        expect(response.body).toHaveProperty("description", newIssue.description);
        expect(response.body).toHaveProperty("status", "open");
        expect(response.body).toHaveProperty("tags");
    });

    it("should return 400 if required fields are missing", async () => {
        const response = await request(app)
            .post("/api/issues")
            .send({ description: "Missing title and projectId" });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Project ID and title are required");
    });
});

describe("API /api/issues/:id", () => {
    it("should update a specific issue by ID", async () => {
        const createRes = await request(app)
            .post("/api/issues")
            .send({ projectId: 1, title: "Test Issue", description: "This is a test issue." });
        
        const issueId = createRes.body.id;

        const updateRes = await request(app)
            .put(`/api/issues/${issueId}`)
            .send({ title: "Updated Test Issue", status: "closed" });

        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty("title", "Updated Test Issue");
        expect(updateRes.body).toHaveProperty("status", "closed");
       
    });
});

describe("API /api/issues/:id DELETE", () => {
    it("should delete a specific issue by ID", async () => {
        const createRes = await request(app)
            .post("/api/issues")
            .send({ projectId: 1, title: "Issue to be deleted", description: "This issue will be deleted." });

        const issueId = createRes.body.id;
        
        const deleteRes = await request(app)
            .delete(`/api/issues/${issueId}`);
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body).toHaveProperty("message", "Issue deleted");
        
        const getRes = await request(app)
            .get("/api/issues");
        const issueExists = getRes.body.some(issue => issue.id === issueId);
        expect(issueExists).toBe(false);
    });
});

describe("API /api/issues/:id 404 handling", () => {
    it("should return 404 when updating a non-existent issue", async () => {
        const response = await request(app)
            .put("/api/issues/99999")
            .send({ title: "Non-existent Issue" });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Issue not found");
    }
);
});

describe("API /api/issues/:id DELETE 404 handling", () => {
    it("should return 404 when deleting a non-existent issue", async () => {
        const response = await request(app)
            .delete("/api/issues/99999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Issue not found");
    });
});