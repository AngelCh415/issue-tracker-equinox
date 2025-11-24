import { Router } from "express";

const router = Router();
const projects = [
    { id: 1, name: "Project Alpha", description: "First project" },
];

router.get("/", (req, res) => {
    res.json(projects);
});

router.post("/", (req, res) => {
    const newProject = {
        id: projects.length + 1,
        name,
        description
    };
    projects.push(newProject);
    res.status(201).json(newProject);
});

export default router;