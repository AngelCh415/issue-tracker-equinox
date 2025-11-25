import { Router } from "express";
import { all, run, get} from "../db.js"
const router = Router();


router.get("/", async(req, res) => {
    try{
      const projects = await all("SELECT id, name, description FROM projects ORDER BY id ASC");
      console.log("Projects fetched:", projects);
      res.json(projects);
    }catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/', async (req, res) => {
    const { name, description } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    try
    {
      const result = await run (
      'INSERT INTO projects (name, description) VALUES (?, ?)',
      [name, description || ""]

    );
    const project = await get (
      'SELECT id, name, description FROM projects WHERE id = ?',
      [result.lastID]
    );
    res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default router;