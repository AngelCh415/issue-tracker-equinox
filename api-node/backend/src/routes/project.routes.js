import { Router } from "express";

const router = Router();
const projects = [
    { id: 1, name: "Project Alpha", description: "First project" },
];

router.get("/", (req, res) => {
    res.json(projects);
});

router.post('/', (req, res) => {
    const { name, description } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
  
    const newProject = {
      id: projects.length + 1,
      name,
      description: description || ''
    };
  
    projects.push(newProject);
  
    res.status(201).json(newProject);
  });

export default router;