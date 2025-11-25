import { Router } from "express";
import { readDB, writeDB } from "../db";

const router = Router();


router.get("/", (req, res) => {
    const db = readDB();
    res.json(db.projects);
});

router.post('/', (req, res) => {
    const { name, description } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
  
    const db = readDB();
    const projects = db.projects || [];
    const newProject = {
      id: projects.length ? projects[projects.length - 1].id + 1 : 1,
      name,
      description: description || ''
    }
    projects.push(newProject);

    writeDB({ ...db, projects });
    res.status(201).json(newProject);
  });

export default router;