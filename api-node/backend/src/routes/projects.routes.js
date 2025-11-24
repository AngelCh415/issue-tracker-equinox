import { Router } from "express";

const router = Router();
const projects = [
    { id: 1, name: "Project Alpha", description: "First project" },
];

router.get("/", (req, res) => {
    res.json(projects);
});

export default router;